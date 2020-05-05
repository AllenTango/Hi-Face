// pages/charm/charm.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
  },

  doUpload: function () {
    const self = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = `image${Math.floor(Math.random() * 10000000)}` + filePath.match(/\.[^.]+?$/)[0]
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
                  name: "aicut",
                  data: {
                    fileID,
                    size:[{
                      width: 300,
                      height: 300
                    }]
                  }
                }).then(({result}) => {
                  wx.cloud.callFunction({
                    name: 'aicharm',
                    data: {
                      MaxFaceNum: 1,
                      MinFaceSize: 40,
                      fileID,
                      Url: result[0]
                    }
                  }).then(res => console.log(res))
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: '#999da4',
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})