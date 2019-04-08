import '../../css/address.css';
const $ = require('jquery');
// import '../../plugin/distpicker.min.js'
let isOK = false;//表单验证表示
$('.address').distpicker({
    province: '省份名',
    city: '城市名',
    district: '区名'
});
//提交地址
$('.submit').on('click', () => {
    let data = checkForm()
    if(isOK) return ;
    $('.model_name').val(data.name);
    $('.model_phone').val(data.phone);
    $('.model_address').val(data.address);
    //确认模态框显示
    $('.model_success').show();
    //确认提交数据
    $('.model_affirm').on('click',()=>{
        var province = $('#eprovinceName').find("option:selected").text(); //收货地区省
        console.log(province)
        if(province=='新疆维吾尔自治区'||province == '西藏自治区' ||province =='内蒙古自治区'){
            $('.model_addPrice').show();
            console.log($('.model_addPrice'))
        }
    });
    //取消
    $('.model_close').on('click',()=>{
        $('.model_success').hide();
    })
})
//表单信息获取
function checkForm() {
    let name = $('.name').val(); //收货人
    let phone = $('.phone').val()-0; //联系电话
    let address = $('.address_main').val(); //收货地址
    let province = $('#eprovinceName').find("option:selected").text(); //收货地区省
    let city = $('#ecity').find("option:selected").text(); //收货地区市
    let district = $('#edistrictName').find("option:selected").text(); ////收货地区区
    if (!name) return modelMsg('收货人不能为空！')
    if (!phone) return modelMsg('联系人电话不能为空！')
    if (!address) return modelMsg('收货地址不能为空！')
    if (!province) return modelMsg('请选择地区省份！')
    if (!/^1[3-9]\d{9}$/i.test(phone)) return modelMsg('请填写正确的联系电话！');
    address =""+province+"+"+city+"+"+district+"+"+address+""; 
    return {'name':name,'phone':phone,'address':address,'expressCompany':'',"expressNumber":'','activityId':'','signCommodityId':'','signCommodityName':''}
}
//msg弹框
function modelMsg(msg) {
    msg = msg || '请求错误！';
    console.log( msg);
    $('.dialog_msg').html(msg);
    $('#dialog').show();
    $('.dialog_ft').on('click', () => {
        $('#dialog').hide();
    });
    return isOK = true;
}