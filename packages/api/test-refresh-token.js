/* eslint-env node */
// 测试 refresh token 机制
const API_BASE = "http://localhost:8787";

async function testRefreshToken() {
  console.log("🧪 测试 Refresh Token 机制...\n");

  try {
    // 1. 先注册一个测试用户
    console.log("1. 注册测试用户...");
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        nickname: "测试用户",
      }),
    });

    if (registerResponse.ok) {
      console.log("✅ 注册成功");
    } else {
      const errorData = await registerResponse.json();
      if (errorData.message?.includes("已存在")) {
        console.log("ℹ️ 用户已存在，继续测试");
      } else {
        console.log("❌ 注册失败:", errorData.message);
        return;
      }
    }

    // 2. 登录获取 session token 和 refresh token
    console.log("\n2. 用户登录...");
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: "testuser",
        password: "password123",
      }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.log("❌ 登录失败:", errorData.message);
      return;
    }

    const loginData = await loginResponse.json();
    console.log("✅ 登录成功");
    console.log("   - 用户:", loginData.user.username);
    console.log(
      "   - Session Token 过期时间:",
      new Date(loginData.session_expires_at).toLocaleString(),
    );
    console.log(
      "   - Refresh Token 过期时间:",
      new Date(loginData.refresh_expires_at).toLocaleString(),
    );

    // 3. 使用 session token 访问受保护资源
    console.log("\n3. 访问受保护资源...");
    const meResponse = await fetch(`${API_BASE}/auth/me`, {
      credentials: "include",
    });

    if (meResponse.ok) {
      const userData = await meResponse.json();
      console.log("✅ 成功获取用户信息:", userData.user.username);
    } else {
      console.log("❌ 获取用户信息失败");
    }

    // 4. 测试 refresh token 功能
    console.log("\n4. 测试 refresh token...");
    const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      console.log("✅ Refresh token 成功");
      console.log(
        "   - 新的 Session Token 过期时间:",
        new Date(refreshData.session_expires_at).toLocaleString(),
      );
    } else {
      const errorData = await refreshResponse.json();
      console.log("❌ Refresh token 失败:", errorData.message);
    }

    // 5. 再次访问受保护资源验证新 token
    console.log("\n5. 验证新的 session token...");
    const meResponse2 = await fetch(`${API_BASE}/auth/me`, {
      credentials: "include",
    });

    if (meResponse2.ok) {
      const userData2 = await meResponse2.json();
      console.log("✅ 使用新 token 成功获取用户信息:", userData2.user.username);
    } else {
      console.log("❌ 使用新 token 获取用户信息失败");
    }

    // 6. 登出
    console.log("\n6. 用户登出...");
    const logoutResponse = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (logoutResponse.ok) {
      console.log("✅ 登出成功");
    } else {
      console.log("❌ 登出失败");
    }

    // 7. 验证登出后无法访问
    console.log("\n7. 验证登出后无法访问...");
    const meResponse3 = await fetch(`${API_BASE}/auth/me`, {
      credentials: "include",
    });

    if (!meResponse3.ok) {
      console.log("✅ 登出后无法访问受保护资源（符合预期）");
    } else {
      console.log("❌ 登出后仍能访问受保护资源（异常）");
    }

    console.log("\n🎉 Refresh Token 测试完成！");
  } catch (error) {
    console.error("❌ 测试过程中发生错误:", error.message);
  }
}

// 运行测试
testRefreshToken();
