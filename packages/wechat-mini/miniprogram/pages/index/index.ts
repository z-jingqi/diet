// 重写页面为 WebView 形式，去除模板示例代码
Page({
  data: {
    webUrl: "",
  },

  onLoad() {
    // 调用 wx.login 获取用户临时登录凭证 code，并拼接到 H5 地址
    wx.login({
      success: (res) => {
        // 根据环境决定 H5 地址
        let baseUrl = "https://your-h5-domain.com"; // 默认生产地址（占位）

        try {
          const accountInfo = wx.getAccountInfoSync();
          // envVersion: develop | trial | release
          if (accountInfo?.miniProgram?.envVersion === "develop") {
            baseUrl = "http://localhost:5173";
          }
        } catch (err) {
          // getAccountInfoSync 可能在老版本基础库不可用，忽略错误
        }

        const url = `${baseUrl}?code=${res.code}`;
        this.setData({ webUrl: url });
      },
      fail: () => {
        // 获取 code 失败时，依旧跳转到 H5，但不携带 code
        const fallbackUrl =
          wx.getAccountInfoSync?.()?.miniProgram?.envVersion === "develop"
            ? "http://localhost:5173"
            : "https://your-h5-domain.com";

        this.setData({ webUrl: fallbackUrl });
      },
    });
  },
});
