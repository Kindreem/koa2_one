const router = require('koa-router')()
const data = require('../dbs/data') // 调用data.js中的mongoose数据对象

router.prefix('/datas')

// 实现数据的添加
router.post('/addData',async function(ctx,next){
  console.log(ctx.request.body, 111111)
  try {
    await Promise.all(ctx.request.body.map((el) => {
      return new Promise(async (resolve, reject) => {
        const obj = await data.find({name: el.name})

        if (obj && obj.length) { // 编辑
          data.findOneAndUpdate({
            name: el.name
          }, { $set: {
            count: obj[0].count + 1,
            time: Math.round((obj[0].count * obj[0].time + el.time) / (obj[0].count + 1))
          }}, {}, (err, res) => {
            if (err) {
              console.log("Error:" + err);
              reject(err)
            } else {
              console.log("Res:" + res);
              resolve(res)
            }
          })

        } else { // 新增
          let result = new data({  // 给data数据对象中添加数据
            time: el.time, // 设置数据
            name: el.name,
            count: 1
          })

          result.save((err, res) => { // 把设置好数据提交
            if (err) {
              console.log("Error:" + err);
              reject(err)
            } else {
              console.log("Res:" + res);
              resolve(res)
            }
          })
        }
      })
    }))
    ctx.body = '上传成功'
  } catch (error) {
    ctx.body = error
  }
});

module.exports = router
