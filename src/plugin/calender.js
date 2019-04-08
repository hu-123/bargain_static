
  /*
   * 用于记录日期，显示的时候，根据dateObj中的日期的年月显示
   */
  var dateObj = (function(){
    var _date = new Date();    // 默认为当前系统时间
    return {
      getDate : function(){
        return _date;
      },
      setDate : function(date) {
        _date = date;
      }
    };
  })();
  // 设置calendar div中的html部分
  renderHtml();
  // 表格中显示日期
  showCalendarData();
  // 绑定事件
  bindEvent();
 
  /**
   * 渲染html结构
   */
  function renderHtml() {
    var calendar = document.getElementById("date_content");
    var titleBox = document.createElement("div");  // 标题盒子 设置上一月 下一月 标题
    var bodyBox = document.createElement("div");  // 表格区 显示数据
 
    // 设置标题盒子中的html
    titleBox.className = 'calendar-title-box';
    titleBox.innerHTML = "<span class='prev-month' id='prevMonth'></span>" +
      "<span class='calendar-title' id='calendarTitle'></span>" +
      "<span id='nextMonth' class='next-month'></span>";
    calendar.appendChild(titleBox);    // 添加到calendar div中
 
    // 设置表格区的html结构
    bodyBox.className = 'calendar-body-box';
    var _headHtml = "<tr class='calendar-head'>" + 
              "<th>日</th>" +
              "<th>一</th>" +
              "<th>二</th>" +
              "<th>三</th>" +
              "<th>四</th>" +
              "<th>五</th>" +
              "<th>六</th>" +
            "</tr>";
    var _bodyHtml = "";
 
    // 一个月最多31天，所以一个月最多占6行表格
    for(var i = 0; i < 6; i++) {  
      _bodyHtml += "<tr>" +
              "<td></td>" +
              "<td></td>" +
              "<td></td>" +
              "<td></td>" +
              "<td></td>" +
              "<td></td>" +
              "<td></td>" +
            "</tr>";
    }
    bodyBox.innerHTML = "<table id='calendarTable' class='calendar-table'>" +
              _headHtml + _bodyHtml +
              "</table>";
    // 添加到calendar div中
    calendar.appendChild(bodyBox);
  }
 
  /**
   * 表格中显示数据，并设置类名
   */
  function showCalendarData() {
    var _year = dateObj.getDate().getFullYear();
    var _month = dateObj.getDate().getMonth() + 1;
    var _dateStr = getDateStr(dateObj.getDate());
 	
    // 设置顶部标题栏中的 年、月信息
    var calendarTitle = document.getElementById("calendarTitle");
    var titleStr = _dateStr.substr(0, 4) + "年" + _dateStr.substr(4,2) + "月";
    calendarTitle.innerText = titleStr;
 		
 		//console.log(_dateStr.substr(0, 4)) //2018---------------------------------------------年
 		//console.log(_dateStr.substr(4,2))  //07-------------------------------------------------月
 		
		//console.log(titleStr)		//2018年07月-------------------------------------------------标题上当前的月份
 		// 设置表格中的日期数据
    var _table = document.getElementById("calendarTable");
    var _tds = _table.getElementsByTagName("td");
    var _firstDay = new Date(_year, _month - 1, 1);  // 当前月第一天
    for(var i = 0; i < _tds.length; i++) {
      var _thisDay = new Date(_year, _month - 1, i + 1 - _firstDay.getDay());
      var _thisDayStr = getDateStr(_thisDay);
      _tds[i].innerText = _thisDay.getDate();
      //_tds[i].data = _thisDayStr;
      _tds[i].setAttribute('data', _thisDayStr);
      
			//console.log(_thisDayStr);  //20180429------------------------------------------每次循环出来的日期值
      if(_thisDayStr == getDateStr(new Date())) {    // 当前天（今天）
      	_tds[i].className = 'currentDay'; // 今日-----------------------------------------（在这里判断今天是否签到)
			 	_tds[i].className = 'currentactiveMonth';//已经签到了使用这个class
        
        _tds[i].innerHTML = '今';
      }else if(_thisDayStr.substr(0, 6) == getDateStr(_firstDay).substr(0, 6)) {
        _tds[i].className = 'currentMonth';  // 当前月-----------------------------------（在这里判断本月签到)
					_tds[i].className = 'activetMonth'; //已经签到了使用这个class
					_tds[20].className = 'miss';  //漏签使用这个class
					_tds[19].className = 'miss';  //漏签使用这个class
					_tds[18].className = 'miss';  //漏签使用这个class
			
      }else {    // 其他月
        _tds[i].className = 'otherMonth';
//      console.log(i);
      }
    }
    
  }
  /**
   * 绑定上个月下个月事件
   */
  function bindEvent() {
    var prevMonth = document.getElementById("prevMonth");
    var nextMonth = document.getElementById("nextMonth");
    addEvent(prevMonth, 'click', toPrevMonth);
    addEvent(nextMonth, 'click', toNextMonth);
  }
  /**
   * 绑定事件
   */
  function addEvent(dom, eType, func) {
    if(dom.addEventListener) {  // DOM 2.0
      dom.addEventListener(eType, function(e){
        func(e);
      });
    } else if(dom.attachEvent){  // IE5+
      dom.attachEvent('on' + eType, function(e){
        func(e);
      });
    } else {  // DOM 0
      dom['on' + eType] = function(e) {
        func(e);
      }
    }
  }
 
  /**
   * 点击上个月图标触发
   */
  function toPrevMonth() {
    var date = dateObj.getDate();
    dateObj.setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    showCalendarData();
    miss();
  }
 
  /**
   * 点击下个月图标触发
   */
  function toNextMonth() {
    var date = dateObj.getDate();
    var ss= dateObj.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    showCalendarData();
    miss();
  }
 
  /**
   * 日期转化为字符串， 4位年+2位月+2位日
   */
  function getDateStr(date) {
    var _year = date.getFullYear();
    var _month = date.getMonth() + 1;    // 月从0开始计数
    var _d = date.getDate();
     
    _month = (_month > 9) ? ("" + _month) : ("0" + _month);
    _d = (_d > 9) ? ("" + _d) : ("0" + _d);
    return _year + _month + _d;
  }
	/**
	 * 漏签加文字为  补
	 */
	function miss(){
		var misslis = document.getElementsByClassName("miss");
		for(var i=0,len=misslis.length;i<len;i++){
			misslis[i].innerHTML='补';
			misslis[i].onclick = function(){
        var date_miss =this.getAttribute('data');
        var dataDom = document.querySelector('.success_msg h3');
        dataDom.innerHTML = "是否对"+date_miss+"进行补签";
        var model = document.querySelector('#model_success');
        model.style.display = 'block';
			}
		}
	}
	miss();