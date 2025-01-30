---
sidebar_position: 3
---

# WSL2
如果有在Linux下开发软件的需求，同时你又不能放弃windows下的软件生态，那么WSL2应该是最佳选择。相较于双系统，WSL2可以和windows一起运行，相较于虚拟机，WSL2的配置更加简单，与vscode无缝连接。详细教程可以查看[WSL文档](https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment)

## 安装
```powershell
# 管理员模式打开Powershell，默认安装ubuntu最新版，安装后重启
wsl --install
```

## 配置
使用code打开文件 `code $HOME/.wslconfig` ，写入内容：
```sh title="$HOME/.wslconfig"
[wsl2]
# 设置网络模式为镜像，使Linux的网络环境与Windows相同
networkingMode=mirrored
dnsTunneling=true
# 设置最大内存
memory=24GB
# 设置交换内存，
swap=16GB
```

## 第一次启动
第一次启动需要设置Linux用户，该用户被视为Linux管理员，能够运行 `sudo` 管理命令。从开始菜单进入，点击ubuntu或在powershell键入 `ubuntu` 打开，输入用户名和密码。修改密码需要在Linux中输入 `psswd`。

## 配置Zsh
ubuntu默认的shell为bash，替换为更好用的Zsh：
```sh
# 更新系统
sudo apt update
sudo apt dist-upgrade

# 安装zsh
sudo apt install zsh

# 安装zimfw插件
curl -fsSL https://gh.llkk.cc/https://raw.githubusercontent.com/zimfw/install/master/install.zsh | zsh

# 修复Bug
echo "skip_global_compinit=1" > ~/.zshenv
```