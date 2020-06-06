import api from '../../http/api'
import pinyin from '../../lib/pinyin/index'
// const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    newslist:[],
    piyaolist:[],
    actived: '疫情地图',
    navList: ['疫情地图', '最新消息', '辟谣消息', '疫情趋势'],
    data: ''
  },

  newsDetail:function(e){
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../news/news?src='+dataset.source, //
      success:function() { 
      },       //成功后的回调；
      fail:function() { },         //失败后的回调；
      complete:function() { }      //结束后的回调(成功，失败都会执行)
 })
  },

  piyaoDetail:function(e){
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../news/news?src='+dataset.url, //
      success:function() { 
      },       //成功后的回调；
      fail:function() { },         //失败后的回调；
      complete:function() { }      //结束后的回调(成功，失败都会执行)
 })
  },

  changePage(e) {
    wx.setNavigationBarTitle({
      title: e.currentTarget.dataset.page,
    });
    this.setData({
      actived: e.currentTarget.dataset.page
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    wx.request({
      url: 'http://api.tianapi.com/txapi/ncov/index?key=aac848e23318a9b5891529fa68984d20',       
      success(res) {
        res.data.newslist[0].news.forEach(item=>{console.log(item)})  
        if (res.statusCode == 200) {
         that.setData({ //newslist赋值           
              newslist: res.data.newslist[0].news              
          })                
        }





        wx.request({
          url: 'http://api.tianapi.com/txapi/rumour/index?key=aac848e23318a9b5891529fa68984d20',           
          success(res) {          
              res.data.newslist.forEach(item=>{console.log(item)})  
              if (res.statusCode == 200) {
               that.setData({ //newslist赋值           
                    piyaolist: res.data.newslist
                })          
              }                                             
          },
          fail: function () {
            console.log('------------------fail-------------------');
          }  
        }
       )




      },
      fail: function () {
        console.log('------------------fail-------------------');
      }  
    }
   )

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    api.getChart().then(res => {
      if (res.errcode === 0) {
        this.setData({
          data: res.data
        })
        this.getData(res.data.history)
      }
    })
  },
  getPosition() {
    if (val !== '全国') {
      chartSettings.value.position = 'province/' + pinyin.getFullChars(val).toLowerCase()
    }
  },
  getData(history) {
    let temp = {},
      date = [],
      confirmedList = [],
      suspectedList = [],
      deathsList = [],
      curesList = []
    history.map(item => {
      date.unshift(item.date)
      confirmedList.unshift(item.confirmedNum)
      suspectedList.unshift(item.suspectedNum)
      deathsList.unshift(item.deathsNum)
      curesList.unshift(item.curesNum)
    })
    temp = {
      date: date,
      confirmedList: confirmedList,
      suspectedList: suspectedList,
      deathsList: deathsList,
      curesList: curesList
    }
    console.log(temp);
    this.setData({
      List: temp
    })
    if (this.data.actived === '疫情趋势') {
      setTimeout(() => {
        this.qushi()
      }, 500)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(pinyin.getFullChars('管理员'));
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