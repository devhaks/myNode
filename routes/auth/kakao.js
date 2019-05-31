/**
 * 이 파일은 카카오톡 로그인을 직접 구현해 본 소스코드 입니다.
 */

const console = require("better-console");
const express = require("express");
const qs = require("qs");
const axios = require("axios");

const router = express.Router();

const kakao = {
  clientID: "803fa52145da1c0cc9a748018a95d136",
  clientSecret: "BtSD12taxk3DqusTvOjGBQv2MbZoViI3",
  redirectUri: "http://localhost:8888/auth/kakao/callback"
};

/**
 * @summary 카카오 인증 진행하기
 *
 * @description
 * - '간편 로그인' 링크로 접근 했을 때, '사용자 서비스 동의' 페이지로 리다이렉트 합니다.
 * - redirectUri 는 인증 성공시, 카카오 개발자 콘솔에 기입한 이동할 주소입니다.
 *
 */
router.get("/", (req, res) => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${
    kakao.clientID
  }&redirect_uri=${kakao.redirectUri}&response_type=code`;

  return res.redirect(kakaoAuthUrl);
});

/**
 * @summary 사용자 계정을 provider 로 연동. 인증 정보와 함께 저장
 *
 * @param {*} session 사용자 세션
 * @param {*} provider 공급사
 * @param {*} authData 인증 정보
 */
function linkUser(session, provider, authData) {
  let result = false;
  if (session.authData) {
    if (session.authData[provider]) {
      // 이미 계정에 provider 가 연결되어 있는 경우
      return result;
    }

    session.authData[provider] = authData;
  } else {
    session.authData = {
      [provider]: authData
    };
  }

  result = true;

  return result;
}

/**
 * @summary '사용자 서비스 동의' 완료 후, 이동되는 주소.
 *
 * @description
 * - 사용자로부터 동의를 구한 후, 서비스 내에서 처리할 로직을 구현합니다.
 */

// http://localhost:8888/auth/kakao/callback
router.get("/callback", async (req, res) => {
  const { session, query } = req;
  const { code } = query;

  console.info("==== session ====");
  console.log(session);

  const url = `https://kauth.kakao.com/oauth/token`;

  let tokenResponse;
  try {
    tokenResponse = await axios({
      method: "POST",
      url,
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: qs.stringify({
        grant_type: "authorization_code",
        client_id: kakao.clientID,
        client_secret: kakao.clientSecret,
        redirect_uri: kakao.redirectUri,
        code
      })
    });
  } catch (error) {
    return res.json(error.data);
  }

  console.info("==== tokenResponse.data ====");
  console.log(tokenResponse.data);

  const { access_token } = tokenResponse.data;

  let userResponse;

  try {
    userResponse = await axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
  } catch (error) {
    return res.json(error.data);
  }

  console.info("==== userResponse.data ====");
  console.log(userResponse.data);

  const authData = {
    ...tokenResponse.data,
    ...userResponse.data
  };

  const result = linkUser(session, "kakao", authData);

  if (result) {
    console.info("계정에 연결되었습니다.");
  } else {
    console.warn("이미 연결된 계정입니다.");
  }

  res.redirect("/");
});

/**
 * @summary 카카오로 연동한 계정을 연결 해제. 사용자 authData 정보 삭제.
 *
 * @param {*} session 사용자 세션
 * @param {*} provider 공급사
 */

function unlinkUser(session, provider, userId) {
  let result = false;

  if (
    session.authData &&
    session.authData[provider] &&
    session.authData[provider].id === userId
  ) {
    delete session.authData[provider];
    result = true;
  }
  return result;
}

/**
 * @summary 사용자 앱 연결 해제 링크
 */

// http://localhost:8888/auth/kakao/unlink
router.get("/unlink", async (req, res) => {
  const { session } = req;

  const { access_token } = session.authData.kakao;

  let unlinkResponse;
  try {
    unlinkResponse = await axios({
      method: "POST",
      url: "https://kapi.kakao.com/v1/user/unlink",
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
  } catch (error) {
    return res.json(error.data);
  }

  console.log("==== unlinkResponse.data ====");
  console.log(unlinkResponse.data);

  const { id } = unlinkResponse.data;

  const result = unlinkUser(session, "kakao", id);

  if (result) {
    console.log("연결 해제되었습니다.");
  } else {
    console.log("카카오와 연동된 계정이 아닙니다.");
  }

  res.redirect("/");
});

module.exports = router;
