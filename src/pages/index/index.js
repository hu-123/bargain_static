import '../../css/index.css';
import '../../css/swiper.min.css';
console.log(process.env.NODE_ENV);
$('.goCode').on('click',function(){
    $('.model').show();
    $('body').css({'height':'100vh','overflow':'hidden'});
})
$('.close').on('click',function(){
    $('.model').hide();
})