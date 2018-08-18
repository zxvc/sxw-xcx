// pages/particulars/particulars.js
const app = getApp();
const util = require('../../utils/util.js');
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    id: null,
    mid: null,
    messageList: [],
    message: [
      // { id: '0', head_portrait_icon: '../../images/index/head_portrait.png', icon_vip: '../../images/index/vip.png', name: '董晓珺', position: '销售总监', demand: '供应', company: '董南通金源纺织科技有限公司', lable_three: '混纺纱', lable_four: '纺织用纱', lable_five: '混纺纱', details: '精疏紧密60支,条干13.56,棉结50强力180,气流纺织21,环纺普纱28支，气流纺织21,环纺普纱28支', message_Img: [{ message_Image: '../../images/index/Image_details1.png' }, { message_Image: '../../images/index/Image_details2.png' }, { message_Image: '../../images/index/Image_details3.png' }], release_time: '2018-6-28 14:25', turnover_time: '2018-7-18 14:25', address: '南通、柳橙、诸暨', page_view: '867', like: '128' ,star:'324',share:'126'}, 
    ],

    //留言
    leave_word_details: [{ id: '0', iconImg: '../../images/store/pic_tou_second.png', name: '董晓珺', time: '1天前', leave_word_name: '', content: '您好！请问这个价格如何?' },
    { id: '2', iconImg: '../../images/store/pic_tou_second.png', name: '程晓燕', time: '1天前', leave_word_name: '董晓珺', content: '您需要购买多少呢?' },],

    //名片
    business_card: [],
    sendTranspondChoose: false,
    MyTranspondValue: '',

  },
  //名片详情
  view_card_click: function (e) {
    wx.navigateTo({
      url: '../store_particulars/store_particulars?id=' + e.currentTarget.dataset.id,
    })
  },
  //查看详情
  see_details_click: function (e) {

    console.log(e.currentTarget.dataset.id)

    wx.redirectTo({
      url: '../particulars/particulars?id=' + e.currentTarget.dataset.id + '&mid=' + e.currentTarget.dataset.mid,
    })
  },
  //返回首页
  back_homepage_click: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  //拨打电话
  making_call_click: function () {
    wx.makePhoneCall({
      phoneNumber: that.data.business_card.mobile //仅为示例，并非真实的电话号码
    })
  },

  leaveWordClick: function (e) {
    const that = this;
    that.setData({
      sendTranspondChoose: !that.data.sendTranspondChoose
    })
  },

  // 获取评论信息
  exacommentClick: function (e) {
    const that = this;
    that.setData({
      MyTranspondValue: e.detail.value
    })
  },

  //发送留言
  sendClick: function () {
    let param = {
      userid: wx.getStorageSync('UserInfo').userid,
      _token: wx.getStorageSync('UserInfo')._token,
      item_mid: that.data.mid,
      item_id: that.data.id,
      content: that.data.MyTranspondValue
    };
    util.leaveWord(param, function (ret) {
      console.log('发送留言', ret)
      that.data.leave_word_details.push({
        iconImg: ret.businesscard.avatarUrl,
        truename:ret.businesscard.truename,
        addtime: util.formatTime(new Date(ret.addtime * 1000)),
        content: ret.content,
        itemid:ret.itemid

      })
      that.setData({
        leave_word_details: that.data.leave_word_details,
        sendTranspondChoose: !that.data.sendTranspondChoose,
        MyTranspondValue: ''
      })

    });
  },

  setLikeClick: function (e) {
    const that = this;
    console.log(e.currentTarget.dataset.mid, e.currentTarget.dataset.id)
    var param = {
      // userid: wx.getStorageSync('UserInfo').userid.userid,
      // _token: wx.getStorageSync('UserInfo')._token,
      item_mid: e.currentTarget.dataset.mid,
      item_id: e.currentTarget.dataset.id
    };
    util.setLike(param, function (res) {
      console.log('点击点赞', res);
      if (e.currentTarget.dataset.id == that.data.id && e.currentTarget.dataset.mid==that.data.mid){
      for (let i in that.data.message) {
        if (that.data.message[i].id == res.itemid) {
          that.data.message[i].I_agree = true;
          that.data.message[i].like++;
        }
      }
      that.setData({
        message: that.data.message
      })
      }else{
        for (let i in that.data.messageList) {
          if (that.data.messageList[i].id == res.itemid) {
            that.data.messageList[i].I_agree = true;
            that.data.messageList[i].like++;
          }
        }
        that.setData({
          messageList: that.data.messageList
        })
      }
    }, null)

  },

  enshrineClick: function (e) {
    const that = this;
    console.log(e.currentTarget.dataset.mid, e.currentTarget.dataset.id)
    if (that.data.message[0].I_favortie == false){
    var param = {
      // userid: wx.getStorageSync('UserInfo').userid.userid,
      // _token: wx.getStorageSync('UserInfo')._token,
      mid: e.currentTarget.dataset.mid,
      tid: e.currentTarget.dataset.id
    };
    util.enshrine(param, function (res) {
      console.log('收藏', res);
      that.data.message[0].I_favortie = true;
      that.setData({
        message: that.data.message
      })
    }, null)
    }else{
      var param = {
        // userid: wx.getStorageSync('UserInfo').userid.userid,
        // _token: wx.getStorageSync('UserInfo')._token,
        mid: e.currentTarget.dataset.mid,
        tid: e.currentTarget.dataset.id,
        cancle:'false'
      };
      util.enshrine(param, function (res) {
        console.log('取消收藏', res);
        that.data.message[0].I_favortie = false;
        that.setData({
          message: that.data.message
        })
      }, null)
    }

    that.setData({
      message: that.data.message
    })

  },

  //供应
  sellInfoDetails: function () {
    let param = {
      userid: wx.getStorageSync('UserInfo').userid,
      _token: wx.getStorageSync('UserInfo')._token,
      itemid: that.data.id
    };


    util.sellInfoDetails(param, function (ret) {
      console.log('sellInfoDetails', ret)

      let arr = [];
      for (let i in ret.comments) {

        arr.push({
          addtime: util.formatTime(new Date(ret.comments[i].addtime * 1000)),
          content: ret.comments[i].content,
          itemid: ret.comments[i].itemid,
          truename: ret.comments[i].businesscard.truename,
          iconImg: ret.comments[i].businesscard.avatarUrl,
        })
      }

      console.log(arr)

      that.data.message.push({
        id: ret.itemid, //信息id
        mid: 5,
        head_portrait_icon: ret.user.avatarUrl ? ret.user.avatarUrl : '../../images/index/head_portrait.png', //头像，后面是默认头像
        icon_vip: ret.vip, //  0===非vip 1-3==vip  
        name: ret.businesscard.truename, //用户姓名
        position: ret.businesscard.career, //职位
        demand: '供应', //发布类别  ()
        mobile: ret.mobile,
        company: ret.businesscard.company, //公司
        lableList: ret.tags,
        I_agree: ret.I_agree,
        I_favortie: ret.I_favortie,
        details: ret.introduce, //信息详情描述
        message_Img: //详情图片  后续跟进
          [{
            message_Image: ret.thumb
          },
          {
            message_Image: ret.thumb1
          },
          {
            message_Image: ret.thumb2
          }
          ],
        time: ret.adddate, //发布时间
        addtime: util.formatTime(new Date(ret.addtime * 1000)), //发布详细时间
        edittime: util.formatTime(new Date(ret.edittime * 1000)),
        address: ret.address, //货物存放地
        page_view: ret.hits, //浏览量
        like: ret.agree //点赞
      })
      that.setData({
        message: that.data.message,
        leave_word_details: arr,
        business_card: ret.businesscard
      })
      that.supplyByUserid();
      that.PurchaseByUserid();
      that.tradeByUserid();
    });
  },

  //求购
  buyInfoDetails: function () {
    let param = {
      userid: wx.getStorageSync('UserInfo').userid,
      _token: wx.getStorageSync('UserInfo')._token,
      itemid: that.data.id
    };
    util.buyInfoDetails(param, function (ret) {
      console.log('buyInfoDetails', ret)
      let arr = [];
      for (let i in ret.comments) {

        arr.push({
          addtime: util.formatTime(new Date(ret.comments[i].addtime * 1000)),
          content: ret.comments[i].content,
          itemid: ret.comments[i].itemid,
          truename: ret.comments[i].businesscard.truename,
          iconImg: ret.comments[i].businesscard.avatarUrl,
        })
      }

      that.data.message.push({
        id: ret.itemid, //信息id
        mid: 6,
        head_portrait_icon: ret.user.avatarUrl ? ret.user.avatarUrl : '../../images/index/head_portrait.png', //头像，后面是默认头像
        icon_vip: ret.vip, //  0===非vip 1-3==vip  
        name: ret.businesscard.truename, //用户姓名
        position: ret.businesscard.career, //职位
        demand: '求购', //发布类别  ()
        mobile: ret.mobile,
        company: ret.businesscard.company, //公司
        lableList: ret.tags,
        I_agree: ret.I_agree,
        I_favortie: ret.I_favortie,
        details: ret.introduce, //信息详情描述
        message_Img: //详情图片  后续跟进
          [{
            message_Image: ret.thumb
          },
          {
            message_Image: ret.thumb1
          },
          {
            message_Image: ret.thumb2
          }
          ],
        time: ret.adddate, //发布时间
        addtime: util.formatTime(new Date(ret.addtime * 1000)), //发布详细时间
        edittime: util.formatTime(new Date(ret.edittime * 1000)),
        address: ret.address, //货物存放地
        page_view: ret.hits, //浏览量
        like: ret.agree //点赞
      })
      that.setData({
        message: that.data.message,
        leave_word_details: arr,
        business_card: ret.businesscard
      })
      that.supplyByUserid();
      that.PurchaseByUserid();
      that.tradeByUserid();
    });
  },


  //纺机
  tradeInfoDetails: function () {
    let param = {
      userid: wx.getStorageSync('UserInfo').userid,
      _token: wx.getStorageSync('UserInfo')._token,
      itemid: that.data.id
    };
    util.tradeInfoDetails(param, function (ret) {
      console.log('tradeInfoDetails', ret)
      let arr = [];
      for (let i in ret.comments) {

        arr.push({
          addtime: util.formatTime(new Date(ret.comments[i].addtime * 1000)),
          content: ret.comments[i].content,
          itemid: ret.comments[i].itemid,
          truename: ret.comments[i].businesscard.truename,
          iconImg: ret.comments[i].businesscard.avatarUrl,
        })
      }
      console.log(arr)

      that.data.message.push({
        id: ret.itemid, //信息id
        mid: 88,
        head_portrait_icon: ret.user.avatarUrl ? ret.user.avatarUrl : '../../images/index/head_portrait.png', //头像，后面是默认头像
        icon_vip: ret.vip, //  0===非vip 1-3==vip  
        name: ret.businesscard.truename, //用户姓名
        position: ret.businesscard.career, //职位
        demand: '纺机贸易', //发布类别  ()
        mobile: ret.mobile,
        company: ret.businesscard.company, //公司
        lableList: ret.tags,
        I_agree: ret.I_agree,
        I_favortie: ret.I_favortie,
        details: ret.introduce, //信息详情描述
        message_Img: //详情图片  后续跟进
          [{
            message_Image: ret.thumb
          },
          {
            message_Image: ret.thumb1
          },
          {
            message_Image: ret.thumb2
          }
          ],
        time: ret.adddate, //发布时间
        addtime: util.formatTime(new Date(ret.addtime * 1000)), //发布详细时间
        edittime: util.formatTime(new Date(ret.edittime * 1000)),
        address: ret.address, //货物存放地
        page_view: ret.hits, //浏览量
        like: ret.agree //点赞
      })
      that.setData({
        message: that.data.message,
        leave_word_details: arr,
        business_card: ret.businesscard
      })
      that.supplyByUserid();
      that.PurchaseByUserid();
      that.tradeByUserid();
    });
  },

  //供应信息
  supplyByUserid: function () {
    var conditions = JSON.stringify({ key: ['userid', 'status'], value: [that.data.business_card.userid, '3'] });
    let param = {
      userid: wx.getStorageSync('UserInfo').userid,
      _token: wx.getStorageSync('UserInfo')._token,
      conditions: conditions
    };
    util.supplyByUserid(param, function (ret) {
      console.log('供应信息', ret)
      // that.data.messageList.push(ret.data)
      for (let i in ret.data) {
        that.data.messageList.push({
          id: ret.data[i].itemid, //信息id
          mid: 5,
          head_portrait_icon: ret.data[i].user.avatarUrl ? ret.data[i].user.avatarUrl : '../../images/index/head_portrait.png', //头像，后面是默认头像
          icon_vip: ret.data[i].vip, //  0===非vip 1-3==vip  
          name: ret.data[i].businesscard.truename, //用户姓名
          position: ret.data[i].businesscard.career, //职位
          demand: '供应', //发布类别  ()
          mobile: ret.data[i].mobile,
          company: ret.data[i].businesscard.company, //公司
          lableList: ret.data[i].tags,
          I_agree: ret.data[i].I_agree,
          I_favortie: ret.data[i].I_favortie,
          details: ret.data[i].introduce, //信息详情描述
          message_Img: //详情图片  后续跟进
            [{
              message_Image: ret.data[i].thumb
            },
            {
              message_Image: ret.data[i].thumb1
            },
            {
              message_Image: ret.data[i].thumb2
            }
            ],
          time: ret.data[i].adddate, //发布时间
          addtime: ret.data[i].addtime, //发布详细时间
          address: ret.data[i].address, //货物存放地
          page_view: ret.data[i].hits, //浏览量
          like: ret.data[i].agree //点赞
        })
      }
      that.data.messageList = that.sort(that.data.messageList)
      that.setData({
        messageList: that.data.messageList
      })
    });
  },

  //求购信息
  PurchaseByUserid: function () {
    var conditions = JSON.stringify({ key: ['userid', 'status'], value: [that.data.business_card.userid, '3'] });
    let param = {
      userid: wx.getStorageSync('UserInfo').userid,
      _token: wx.getStorageSync('UserInfo')._token,
      conditions: conditions
    };
    util.PurchaseByUserid(param, function (ret) {
      console.log('求购信息', ret)
      // that.data.messageList.push(ret.data)
      for (let i in ret.data) {
        that.data.messageList.push({
          id: ret.data[i].itemid, //信息id
          mobile: ret.data[i].mobile,
          mid: 6,
          head_portrait_icon: ret.data[i].user.avatarUrl ? ret.data[i].user.avatarUrl : '../../images/index/head_portrait.png', //头像，后面是默认头像
          icon_vip: ret.data[i].vip, //  0===非vip 1-3==vip  
          name: ret.data[i].businesscard.truename, //用户姓名
          position: ret.data[i].businesscard.career, //职位
          demand: '求购', //发布类别  ()
          company: ret.data[i].businesscard.company, //公司
          lableList: ret.data[i].tags,
          I_agree: ret.data[i].I_agree,
          I_favortie: ret.data[i].I_favortie,
          details: ret.data[i].introduce, //信息详情描述
          message_Img: //详情图片  后续跟进
            [{
              message_Image: ret.data[i].thumb
            },
            {
              message_Image: ret.data[i].thumb1
            },
            {
              message_Image: ret.data[i].thumb2
            }
            ],
          time: ret.data[i].adddate, //发布时间
          addtime: ret.data[i].addtime, //发布详细时间
          address: ret.data[i].address, //货物存放地
          page_view: ret.data[i].hits, //浏览量
          like: ret.data[i].agree //点赞
        })
      }
      that.data.messageList = that.sort(that.data.messageList)
      that.setData({
        messageList: that.data.messageList
      })
    });
  },

  //纺织贸易
  tradeByUserid: function () {
    var conditions = JSON.stringify({ key: ['userid', 'status'], value: [that.data.business_card.userid, '3'] });
    let param = {
      userid: wx.getStorageSync('UserInfo').userid,
      _token: wx.getStorageSync('UserInfo')._token,
      conditions: conditions
    };
    util.tradeByUserid(param, function (ret) {
      console.log('纺织贸易', ret)
      for (let i in ret.data) {
        that.data.messageList.push({
          id: ret.data[i].itemid, //信息id
          mid: 88,
          head_portrait_icon: ret.data[i].user.avatarUrl ? ret.data[i].user.avatarUrl : '../../images/index/head_portrait.png', //头像，后面是默认头像
          icon_vip: ret.data[i].vip, //  0===非vip 1-3==vip  
          name: ret.data[i].businesscard.truename, //用户姓名
          position: ret.data[i].businesscard.career, //职位
          demand: '纺机', //发布类别  ()
          mobile: ret.data[i].mobile,
          company: ret.data[i].businesscard.company, //公司
          lableList: ret.data[i].tags,
          I_agree: ret.data[i].I_agree,
          I_favortie: ret.data[i].I_favortie,
          details: ret.data[i].introduce, //信息详情描述
          message_Img: //详情图片  后续跟进
            [{
              message_Image: ret.data[i].thumb
            },
            {
              message_Image: ret.data[i].thumb1
            },
            {
              message_Image: ret.data[i].thumb2
            }
            ],
          time: ret.data[i].adddate, //发布时间
          addtime: ret.data[i].addtime, //发布详细时间
          address: ret.data[i].address, //货物存放地
          page_view: ret.data[i].hits, //浏览量
          like: ret.data[i].agree //点赞
        })
      }
      that.data.messageList = that.sort(that.data.messageList)
      that.setData({
        messageList: that.data.messageList
      })

    });
  },

  //排序
  sort: function (messageALL) {
    var that = this;
    var arr = messageALL;
    console.log("排序", arr);
    for (var i = 0; i < arr.length; i++)
      for (var u = i + 1; u < arr.length; u++) {
        if (arr[i].addtime < arr[u].addtime) {
          //如果 array[i] > <array[u] ，就声明一个缓存遍历 num 存放大的数据，然后把两个数据的下标进行更换，达到升序排序的效果。
          var num = arr[i];
          arr[i] = arr[u];
          arr[u] = num;
        }
      }

    for (var i = 0; i < arr.length; i++) {
      for (var u = i + 1; u < arr.length; u++) {
        if (arr[i].icon_vip < arr[u].icon_vip) {
          //如果 array[i] > <array[u] ，就声明一个缓存遍历 num 存放大的数据，然后把两个数据的下标进行更换，达到升序排序的效果。
          var num = arr[i];
          arr[i] = arr[u];
          arr[u] = num;
        }

      }

    }

    return arr;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    if (options.id && options.mid) {
      that.setData({
        id: options.id,
        mid: options.mid,
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    switch (that.data.mid) {
      case '5':
        that.sellInfoDetails();
        break;
      case '6':
        that.buyInfoDetails();
        break;
      case '88':
        that.tradeInfoDetails();
        break;
    }

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
    return {
      title: '我分享了' + that.data.business_card.truename + '的' + that.data.message[0].demand + '信息',
      path: 'pages/particulars/particulars?id=' + that.data.id + '&mid=' + that.data.mid,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          duration: 1500
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})