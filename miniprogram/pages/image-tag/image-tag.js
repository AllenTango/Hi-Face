// pages/image-tag/image-tag.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    originUrl: "../../images/origin.png",
    isIpx: app.globalData.isIpx,
    isChange: false,
    tags: []
  },

  doUpload: function() {
    const self = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = `image${Math.floor(Math.random()*10000000)}` + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            const fileID = res.fileID
            wx.cloud.callFunction({
              name: "aicheck",
              data: {
                fileID
              },
            }).then(({
              result
            }) => {
              const {
                PoliticsInfo,
                PornInfo,
                TerroristInfo
              } = result
              if (PoliticsInfo.Code == 0 && PornInfo.Code == 0 && TerroristInfo.Code == 0) {
                wx.cloud.callFunction({
                  name: "aitag",
                  data: {
                    fileID
                  }
                }).then(({result}) => {
                  self.setData({
                    originUrl: filePath,
                    isChange: true,
                    tags: [...result]
                  })
                  console.log(result)
                })
              } else {
                wx.showToast({
                  title: '上传图片不规范，请重试',
                  icon: 'none'
                })
              }
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})