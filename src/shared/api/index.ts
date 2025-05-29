import ky from 'ky';

const index = ky.extend({
  hooks: {
    afterResponse: [
      (request, options, response) => {
        // 401 Unauthorized 인 경우 로그인 페이지로 이동
      },
    ],
  },
});

export default index;
