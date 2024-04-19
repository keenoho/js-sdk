export const Plugin = {
  install(sdk) {
    // mail
    sdk.sendMail = function (data) {
      return sdk.request({
        method: 'POST',
        url: '/v1/mail/send',
        data,
      });
    };

    // file
    sdk.getFileToken = function (params) {
      return sdk.request({
        method: 'GET',
        url: '/v1/file/token',
        params,
      });
    };
    sdk.uploadFile = function (filePath, file) {
      sdk
        .request({
          url: '/v1/file/token',
          method: 'POST',
          data: { filePath },
        })
        .then((res) => {
          if (res?.code !== 0) {
            throw res;
          }
          const token = res?.data;
          if (!token) {
            throw new Error('获取上传token失败');
          }
          return token;
        })
        .then((token) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('filePath', filePath);
          formData.append('token', token);

          return sdk.request({
            url: '/v1/file/upload',
            method: 'POST',
            data: formData,
          });
        });
    };
  },
};
