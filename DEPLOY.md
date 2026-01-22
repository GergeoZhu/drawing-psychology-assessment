# 绘画心理测试工具 - GitHub 部署指南

本指南将帮助您将“绘画心理测试工具”部署到 GitHub Pages，实现在线访问。

## 准备工作

1.  下载本指南附带的 `drawing-psychology-assessment.zip` 源码包。
2.  解压源码包到您的电脑上。
3.  确保您拥有一个 GitHub 账号。

## 步骤一：创建 GitHub 仓库

1.  登录 GitHub。
2.  点击右上角的 `+` 号，选择 **New repository**。
3.  在 **Repository name** 中输入 `drawing-psychology-assessment`（或其他您喜欢的名字）。
4.  确保选择 **Public**（免费版 GitHub Pages 需要公开仓库）。
5.  点击 **Create repository**。

## 步骤二：推送代码

在解压后的项目文件夹中，打开终端（Terminal 或 Git Bash），执行以下命令：

```bash
# 初始化 git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit"

# 关联远程仓库（将 <您的GitHub用户名> 替换为您的实际用户名）
git remote add origin https://github.com/<您的GitHub用户名>/drawing-psychology-assessment.git

# 推送代码到主分支
git branch -M main
git push -u origin main
```

## 步骤三：开启 GitHub Pages

1.  代码推送成功后，回到 GitHub 仓库页面。
2.  点击上方的 **Settings**（设置）标签。
3.  在左侧菜单栏中找到 **Pages**。
4.  在 **Build and deployment** 部分：
    *   **Source**: 选择 `GitHub Actions`。
5.  配置完成后，点击页面顶部的 **Actions** 标签，您应该能看到一个名为 "Deploy to GitHub Pages" 的工作流正在运行。
6.  等待约 1-2 分钟，当工作流显示绿色对勾（Success）时，部署完成。
7.  回到 **Settings -> Pages** 页面，顶部会显示您的网站访问链接，例如：`https://username.github.io/drawing-psychology-assessment/`。

## 常见问题

*   **页面一片空白？**
    *   请检查 GitHub Pages 设置中是否选择了 `GitHub Actions` 作为 Source。
    *   如果是手动选择 `Deploy from a branch`，请确保选择 `gh-pages` 分支（如果 Actions 自动创建了该分支）。但在本项目配置中，推荐使用 `GitHub Actions` 源，因为它会自动构建最新代码。

*   **如何更新网站？**
    *   只需在本地修改代码，然后再次执行 `git add .`, `git commit`, `git push`，GitHub 会自动触发新的部署。
