---
sidebar_position: 2
---

# CMake
目前CMake已经成为C++默认的工具了，但CMake的复杂程度不亚于一门语言了，下面给出最核心的CMake语法。
```sh
# CMake项目目录
├───inc
├───src
│   └───main.cpp
└───CMakeLists.txt
```


## CMakeLists基本模板

```CMake
cmake_minimum_required(VERSION 3.28.0)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# C++ Modules支持
# set(CMAKE_CXX_MODULE_STD ON)
# set(CMAKE_EXPERIMENTAL_CXX_IMPORT_STD a9e1cf81-9932-4810-974b-6eccaf14e457)

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

file(GLOB_RECURSE srcs CONFIGURE_DEPENDS src/*.cpp src/*.cc)
add_executable(PojectName srcs)
target_include_directories(${PROJECT_NAME} PUBLIC 
    $<BUILD_INTERFACE:${CMAKE_CURRENT_LIST_DIR}/inc>
)

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

## 程序打包
下面是一个简单跨平台且具有打包功能的CMake项目，利用`cpack`在构建目录运行`cpack .\CPackConfig.cmake`即可
```CMake
cmake_minimum_required(VERSION 3.28.0)

set(CMAKE_CXX_STANDARD 23)
project(show3d VERSION 0.1.0 LANGUAGES C CXX)

set(CMAKE_PREFIX_PATH "C:/Users/Fu/scoop/apps/vcpkg/2025.04.09/installed/x64-windows")

find_package(pangolin REQUIRED)

add_executable(show3d main.cpp)

target_link_libraries(show3d
    PRIVATE
    pango_display
)

install(TARGETS show3d
    RUNTIME DESTINATION bin
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
)

# 依赖安装方法
file(GET_RUNTIME_DEPENDENCIES
    EXECUTABLES show3d.exe
    RESOLVED_DEPENDENCIES_VAR resolved_deps
    UNRESOLVED_DEPENDENCIES_VAR unresolved_deps
    DIRECTORIES "${CMAKE_PREFIX_PATH}/bin"
    PRE_EXCLUDE_REGEXES "system32"
    POST_EXCLUDE_REGEXES "system32"
)
install(FILES ${resolved_deps} DESTINATION bin)


message(STATUS "Resolved dependencies: ${resolved_deps}")
message(STATUS "Unresolved dependencies: ${unresolved_deps}")

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)
```
- 另一依赖安装方法，可以消除警告:
```
set(VCPKG_BIN_DIR "${CMAKE_PREFIX_PATH}/bin")
string(CONFIGURE [[
    file(GET_RUNTIME_DEPENDENCIES
        EXECUTABLES show3d.exe
        RESOLVED_DEPENDENCIES_VAR resolved_deps
        UNRESOLVED_DEPENDENCIES_VAR unresolved_deps
        DIRECTORIES "@VCPKG_BIN_DIR@"
        PRE_EXCLUDE_REGEXES "system32"
        POST_EXCLUDE_REGEXES "system32"
    )
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" 
        FILES ${resolved_deps})
]] code @ONLY)
install(CODE "${code}")
```