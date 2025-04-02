---
sidebar_position: 2
---

# CMake
目前CMake已经成为C++默认的工具了，但CMake的复杂程度不亚于一门语言了，本文直接给出最正确的使用方式。

## 基本模板

```CMake

cmake_minimum_required(VERSION 3.28.0)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD 23)
project(PojectName)

if(MSVC)
    # 获取编译器所在目录
    get_filename_component(MSVC_COMPILER_DIR "${CMAKE_CXX_COMPILER}" DIRECTORY)
    # 推断 MSVC 根目录（假设路径结构为 .../VC/Tools/MSVC/<version>/bin/Hostx64/x64）
    get_filename_component(MSVC_ROOT_DIR "${MSVC_COMPILER_DIR}/../../../" ABSOLUTE)
    # 构造 include 路径
    set(MSVC_INCLUDE_DIR "${MSVC_ROOT_DIR}/include")
    include_directories(${MSVC_INCLUDE_DIR})
endif()

include_directories(inc)
add_executable(PojectName main.cpp)

```

## 使用库

## 导出库
很多时候我们需要使用CMake制作一个库并导出
1. 在`CMakeList.txt`结尾：
```CMake
include(GUNInstallDirs) # GUN安装包结构
include(CMakePackageConfigHelpers) # 包含配置帮助模块

# inc/为头文件目录，根据实际目录替换
install(DIRECTORY inc/ DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}/)
install(TARGETS ${PROJECT_NAME} EXPORT ${PROJECT_NAME}Targets)
install(EXPORT ${PROJECT_NAME}Targets
    FILE ${PROJECT_NAME}Targets.cmake
    NAMESPACE ${PROJECT_NAME}::
    DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/${PROJECT_NAME}
)

# 生成配置文件
configure_package_config_file(
  ${CMAKE_CURRENT_SOURCE_DIR}/Config.cmake.in
  ${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}Config.cmake
  INSTALL_DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/${PROJECT_NAME}
)
install(FILES
  ${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}Config.cmake
  DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/${PROJECT_NAME}
)
```

2. 创建一个名为 `Config.camke.in` 文件：
```CMake
include("${CMAKE_CURRENT_LIST_DIR}/@PROJECT_NAME@Targets.camke")
```