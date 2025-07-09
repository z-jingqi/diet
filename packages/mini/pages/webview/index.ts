// @ts-nocheck
/* global Page, wx */
/// <reference types="miniprogram-api-typings" />

interface IWebviewPageData {
  url: string;
}

Page<IWebviewPageData>({
  data: {
    url: ''
  },
  onLoad() {
    // Determine environment (develop / trial / release)
    const accountInfo = wx.getAccountInfoSync();
    const env = accountInfo?.miniProgram?.envVersion ?? 'develop';
    const baseUrl = env === 'release' ? 'https://your-domain.com' : 'http://localhost:5173';

    // Perform WeChat login to retrieve authentication code
    wx.login({
      success: (res) => {
        const urlWithCode = `${baseUrl}?code=${res.code}`;
        this.setData({ url: urlWithCode });
      },
      fail: () => {
        // Fallback to base URL if login fails
        this.setData({ url: baseUrl });
      }
    });
  }
}); 
