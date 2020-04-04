## 环境部署

### 系统信息

[配置器地址http://172.16.134.210:8080/core/](http://172.16.134.210:8080/core/)
```
// 认证
admin/adminadmin
```

### 基础环境信息

```
1.申请云账户：账号：yc90056351  密码：xy116118
2.VPN网址：vpn.yuchai.com
3.
3.1 服务器 ip：172.16.134.210
3.2 服务器ssh 端口 ：
3.3 账号  ----用堡垒机
3.4 密码   ----用堡垒机
3.5 sudo权限 ----用堡垒机
初次登陆需要修改密码；登陆链接：https://baolei.yuchai.com



注意：安装步骤要形成文档，用于测试、生产环境的安装，玉柴会根据你们提供的文档安装测试、生产环境
```

### 开发环境信息

堡垒机信息
|参数|值|
|---|---|
|认证|yc90056351/ychvpc_dev|

数据库信息

|参数|值|
|---|---|
|root认证|root/root123!@#|
|dev认证|hvpc_dev/hvpc_dev|
|prot|3306|
|ip|172.16.134.210|
|开发数据库|hvpc_dev|

redis信息

|参数|值|
|---|---|
|prot|6379|
|ip|172.16.134.210|
|认证|hvpc_dev|

maven 信息
|参数|值|
|---|---|
|maven home|usr/local/maven|
|版本|3.6.3|

tomcat 信息
|参数|值|
|---|---|
|端口|8080|
|目录|/home/hvpc/tomcat-dev|

---


### 基础软件下载

下载位置
```
/home/software
```

- redis 
```
wget http://download.redis.io/releases/redis-5.0.5.tar.gz
```

- mysql
```
wget https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.24-linux-glibc2.12-x86_64.tar.gz
```
- maven
```
wget http://mirror.bit.edu.cn/apache/maven/maven-3/3.6.2/binaries/apache-maven-3.6.2-bin.tar.gz
```

- tomcat
```
wget http://mirrors.tuna.tsinghua.edu.cn/apache/tomcat/tomcat-9/v9.0.24/bin/apache-tomcat-9.0.24.tar.gz
```


### 基础软件安装
- git (yum install -y git)
- jdk (yum install -y java-1.8.0-openjdk.x86_64)


--- 
### maven 安装

解压
```
cd /home/software
tar -zxvf apache-maven-3.6.2-bin.tar.gz -C /usr/local/
cd /usr/local
mv apache-maven-3.6.2/ maven
```
修改配置文件
```
vi /etc/profile
// 添加如下内容
# maven
export MAVEN_HOME=/usr/local/maven
export PATH=$PATH:$MAVEN_HOME/bin

// 刷新&查看结果
source /etc/profile 
mvn -v
```

---
### redis 安装

安装包
```
cd /home/software
// 解压
tar -zxvf redis-5.0.5.tar.gz -C /usr/local

// 重命名
cd /usr/local
mv redis-5.0.5/ reids/

// 安装
cd redis/
make && make install
```

系统配置
```
cd utils/
cp redis_init_script /etc/init.d/redis

vi /etc/init.d/redis
// 修改
// 端口
REDISPORT=6379
// 服务端
EXEC=/usr/local/redis/src/redis-server
// 客户端
CLIEXEC=/usr/local/redis/src/redis-cli

# pid 位置 默认即可
PIDFILE=/var/run/redis_${REDISPORT}.pid
# 配置文位置
CONF="/usr/local/redis/redis.conf"
```

redis 配置
```
vi /usr/local/redis/redis.conf

## 注释bind ip
# bind 127.0.0.1

## 开启后台启动
daemonize yes
```

启动
```
// 开机启动
chkconfig redis on
// 启动
service redis start
```

---

### mysql 安装

前提环境
```
// 查看是否安装其他数据库
yum list installed | grep mysql
yum list installed | grep mariadb

// 根据情况来定
yum remove mariadb-libs.x86_64
```

创建配置文件(仅参考)
配置文件优先级
- /etc/my.cnf
- /etc/mysql/my.cnf
- /usr/local/mysql/etc/my.cnf
- ~/.my.cnf
    - -defaults-file=#， 只读取指定的文件（不再读取其他配置文件）

- -defaults-extra-file=#， 从其他优先级更高的配置文件中读取全局配置后，再读取指定的配置文件（有些选项可以覆盖掉全局配置从的设定值）
```
cd /etc
rm -rf my.cnf
touch my.cnf
vi my.cnf

// 文件内容如下
[client]
port=3306
socket=/usr/local/mysql/mysql.sock

[mysql]
socket=/usr/local/mysql/mysql.sock

[mysqld]
basedir=/usr/local/mysql/
datadir=/usr/local/mysql/data/
socket=/usr/local/mysql/mysql.sock
port=3306
character_set_server=utf8
lower_case_table_names = 1
max_connections = 4000
max_connect_errors = 1000
user=mysql
sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION

[mysqld_safe]
log-error=/usr/local/mysql/logs/error.log
pid-file=/usr/local/mysql/mysql.pid
log_bin=on
log_bin_basename=/usr/local/mysql/logs/mysql-bin
log_bin_index=/usr/local/mysql/logs/mysql-bin.index
server-id=123456
```
解压
```
cd /home/software
// 解压
tar -zxvf mysql-5.7.24-linux-glibc2.12-x86_64.tar.gz -C /usr/local
// 重命名文件
cd /usr/local
mv mysql-5.7.24-linux-glibc2.12-x86_64/ mysql/

```
创建必要文件
```
// 创建配置相关文件根据需求
cd /usr/local/mysql
touch mysql.sock
touch mysql.pid
mkdir logs
touch logs/error.log

// 创建用户
groupadd -r mysql && useradd -r -g mysql -s /sbin/nologin -M mysql

// 如果遇到如下问题：
// error while loading shared libraries: libnuma.so.1: cannot open shared object file: No such file or directory

yum install numactl
```
安装
```
// 初始化数据库
./bin/mysqld --initialize

// 修改权限
chown -R mysql:mysql /usr/local/mysql

./bin/mysqld_safe --skip-grant-tables &

// 打开mysql客户端
./bin/mysql -u root -p
// enter
update mysql.user set authentication_string=password('root123!@#') where user ='root' and Host = 'localhost';
// 刷新权限
// flush privileges;
exit

// 重启数据库
kill -9 ${pid1} && kill -9 ${pid2}
./usr/local/mysql/support-files/mysql.server start
```
配置root远程连接
```
./bin/mysql -u root -p
// 输入密码

// 如果出现问题 ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.
alter user 'root'@'localhost' identified BY 'root123!@#';

grant all privileges on *.* to root@'%' identified by 'root123!@#';
flush privileges;
```

防火墙设置（需要时候再用）
```
firewall-cmd --zone=public --add-port=3306/tcp --permanent && firewall-cmd --reload
```
service 命令配置 & 开机启动
```
// 复制启动文件 & 命名mysqld
cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysqld

// 授权
chmod +x /etc/init.d/mysqld

chkconfig --add mysqld
// chkconfig --level 345 mysqld on

chkconfig --list
// 结果
// mysqld 0:off 1:off 2:on 3:on 4:on 5:on 6:off

// 配置客户端 mysql 命令
vi /etc/profile

// 添加如下内容
# mysql
export MYSQL_HOME=/usr/local/mysql
export PATH=$PATH:$MYSQL_HOME/bin

// 刷新文件
source /etc/profile

// 如果遇到 vi ls等命令在刷新文件之后不能使用
// 1.检查profile 有问题修改后刷新
/bin/vim /etc/profile
// 2.重新连接ssh
```
创建开发数据库
```
create schema hvpc_dev default character set utf8;
```
创建开发账户
```
CREATE USER hvpc_dev@'%' IDENTIFIED BY 'hvpc_dev';
CREATE USER hvpc_dev@'localhost' IDENTIFIED BY 'hvpc_dev';

GRANT ALL PRIVILEGES ON hvpc_dev.* TO hvpc_dev@'%';
GRANT ALL PRIVILEGES ON hvpc_dev.* TO hvpc_dev@'localhost';
flush privileges;
```

---
### web容器准备
解压安装
```
cd /home/software
tar -zxvf {tomcat文件}.tar.gz -C /home/hvpc
cd /home/hvpc

// 重命名
mv {tomcat初始化文件目录}/ tomcat-dev/
```

添加基础配置
```
/home/hvpc/tomcat-dev/conf
vi context.xml

// 添加如下配置

<Resource auth="Container" driverClassName="com.mysql.jdbc.Driver" url="jdbc:mysql://127.0.0.1:3306/hvpc_dev" name="jdbc/hap_dev" type="javax.sql.DataSource" username="hvpc_dev" password="hvpc_dev"/>
```

---

### 代码获取

生产环境推荐上传war包
开发环境可以使用jenkins等方式
```
联系开发人员
```

部署 
将 core.war 移动到 tomcat路径下webapp目录下
```
cd {tomcat路径}
./bin/startup.sh
```

---

### 初始化数据

- 框架基础数据
```
cd /home/hvpc/HVPC

mvn process-resources -D skipLiquibaseRun=false -D db.driver=com.mysql.jdbc.Driver -D db.url=jdbc:mysql://127.0.0.1:3306/hvpc_dev -D db.user=hvpc_dev -D db.password=hvpc_dev
```

- 导入配置器表脚本（见压缩包sql文件）
- 导入期初数据