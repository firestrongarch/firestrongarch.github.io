---
sidebar_position: 3
---

# C++模块

C++20引入了模块(module)作为新的代码组织方式，替代传统的头文件机制，编译时间大幅减少。

## 创建模块
一个基本的模块文件示例(`math.cppm`):
```cpp
// math.cppm
export module math;

export int add(int a, int b) {
    return a + b;
}
```

```CMakeLists
# CMAkeLists.txt
add_library(math SHARED)
target_sources(math PUBLIC FILE_SET CXX_MODULES FILES math.cppm) #添加模块文件

```

## 导入模块
```cpp
// main.cpp
import math;  // 导入math模块

int main() {
    int result = add(3, 4);  // 使用模块中的函数
    return 0;
}
```

```CMakeLists
# CMAkeLists.txt
add_executable(main main.cpp)
target_link_libraries(main PRIVATE slam) # 链接到模块库
```

## 标准库模块

C++23开始为标准库提供模块化支持：

```cpp
// main.cpp
import std;

int main() {
    std::cout << "Hello from std.core module\n";
    std::vector<int> v{1, 2, 3};
    return 0;
}
```

有两种使用标准库模块的方式，第一种是启用CMake实验性配置：
```CMakeLists
# CMakeLists.txt
cmake_minimum_required(VERSION 4.1.0)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_STANDARD 23)

add_compile_options(-pthread -fopenmp=libomp) # 标准库模块编译选项要与项目保持一致，根据实际报错情况调整

# 根据CMake版本调整 CMAKE_EXPERIMENTAL_CXX_IMPORT_STD 值，此处为4.1.0版本
set(CMAKE_EXPERIMENTAL_CXX_IMPORT_STD d0edc3af-4c50-42ea-a356-e2862fe7a444) 
set(CMAKE_CXX_MODULE_STD 1)
set(CMAKE_CXX_EXTENSIONS ON)

project(main)
add_executable(main main.cpp)
```

第二种方式，与创建模块类似，在CMakeLists.txt中添加模块文件：
```CMakeLists
# CMakeLists.txt
cmake_minimum_required(VERSION 4.1.0)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_STANDARD 23)

add_compile_options(-pthread -fopenmp=libomp) # 标准库模块编译选项要与项目保持一致，根据实际报错情况调整

project(main)

# 标准库模块文件可以在LLVM安装目录下/share/libc++/v1中找到
add_library(std SHARED)
target_link_directories(std PRIVATE "std")
target_sources(std PUBLIC FILE_SET CXX_MODULES FILES "std/std.cppm")

add_executable(main main.cpp)
target_link_libraries(main PRIVATE std)
```

## 头文件迁移至模块
观察`std.cppm`不难发现，头文件迁移至模块只需先包含对应头文件，然后使用`using`关键字导出其中的内容即可。
**OpenCV的头文件迁移示例：**
```cpp
// cv.cppm
module; //声明一个全局模块片段，用于编写预处理指令，例如#include等
#include <opencv2/opencv.hpp>
export module cv;

export namespace cv {

using cv::Mat;

using cv::circle;
using cv::cvtColor;

using cv::imread;
using cv::imshow;
using cv::waitKey;

using cv::KeyPoint;
using cv::Point2f;

using cv::ORB;
using cv::SIFT;
};
```
```CMakeLists.txt
# CMakeLists.txt
find_package(OpenCV REQUIRED)
add_library(cv SHARED)
target_sources(cv PUBLIC FILE_SET CXX_MODULES FILES src/cv.cppm)
target_link_libraries(cv PUBLIC ${OpenCV_LIBS})
```

## 注意事项
1. 模块编译选项要与项目保持一致，根据实际报错情况调整。
2. 尽量不要混用模块和传统头文件，会增加编译时间，涉及所有权问题，可能导致编译错误。

## 参考文献

1. [Modules (since C++20) - cppreference.com](https://en.cppreference.com/w/cpp/language/modules.html)