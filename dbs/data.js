const mongoose = require('mongoose');
const Data = new mongoose.Schema({ // 实列化mongoose映射
  name: String, // 页面名称
  time: Number, // 平均停留时间
  count: Number // 点击次数
});
module.exports = mongoose.model('Data', Data) // 创建一个mongoose对象模型
