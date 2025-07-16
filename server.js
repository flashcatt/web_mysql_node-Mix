const http = require('http');
const url = require('url');
const mysql = require('mysql');

// 创建数据库连接
const connection = mysql.createConnection({
  host: '124.223.172.225',
  user: 'root1',
  password: 'Mysql123.',
  database: 'todo'
});

// 连接数据库
connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err.stack);
    return;
  }
  console.log('成功连接到数据库');
});

const server = http.createServer((req, res) => {
  // 添加CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, PUT, POST'); // 添加POST方法
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const parsedUrl = url.parse(req.url, true);
  
  // 新增POST路由
  if (req.method === 'POST' && parsedUrl.pathname === '/add') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { brand, model, screen_size, battery_capacity, cpu } = JSON.parse(body);
        const query = 'INSERT INTO phones (brand, model, screen_size, battery_capacity, cpu) VALUES (?, ?, ?, ?, ?)';
        connection.query(query, [brand, model, screen_size, battery_capacity, cpu], (error, results) => {
          if (error) {
            console.error('新增错误:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '新增失败' }));
            return;
          }
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: '新增成功', id: results.insertId }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '无效的请求格式' }));
      }
    });
  } else if (req.method === 'PUT' && parsedUrl.pathname === '/edit') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const {  brand, model, screen_size, battery_capacity, cpu } = JSON.parse(body);
        const query = 'UPDATE test SET brand=?,  screen_size=?, battery_capacity=?, cpu=? WHERE model=?';
        connection.query(query, [brand,  screen_size, battery_capacity, cpu, model], (error, results) => {
          if (error) {
            console.error('更新错误:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '更新失败' }));
            return;
          }
          if (results.affectedRows === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '未找到指定记录' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: '更新成功' }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '无效的请求格式' }));
      }
    });
  } else if (req.method === 'GET' && parsedUrl.pathname === '/query') {
    // 模拟数据库查询结果
    // 查询数据库
    const query = 'SELECT * FROM phones';
    connection.query(query, (error, results) => {
      if (error) {
        console.error('查询错误:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '数据库查询失败' }));
        return;
      }
      // 修改这里：将结果转换为更友好的格式
      const formattedResults = results.map(item => JSON.stringify(item)).join('<br>');
      const data = {
        message: formattedResults,
        rawData: results // 保留原始数据供前端使用
      };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    });

  } else if(req.method === 'GET' && parsedUrl.pathname === '/getinfo'){
    
  }





  
  else if (req.method === 'DELETE' && parsedUrl.pathname === '/delete') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { model } = JSON.parse(body);
      const query = 'DELETE FROM test WHERE model = ?';
      connection.query(query, [model], (error, results) => {
        if (error) {
          console.error('删除错误:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '删除失败' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '删除成功' }));
      });
    });
  } else if (req.method === 'OPTIONS') { // 处理预检请求
    res.writeHead(200);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});