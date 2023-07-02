/**
 * wlp - captcha
 * v0.0.1
 */
export default {
    Captcha_geely,
    YiDunSlider
}
/**
 * 吉利汽车短信登录验证
 * 滑块Slider use:Tencent-Slider
 */
function Captcha_geely() {
    // 定义回调函数
    function callback(res) {
        // 第一个参数传入回调结果，结果如下：
        // ret         Int       验证结果，0：验证成功。2：用户主动关闭验证码。
        // ticket      String    验证成功的票据，当且仅当 ret = 0 时 ticket 有值。
        // CaptchaAppId       String    验证码应用ID。
        // bizState    Any       自定义透传参数。
        // randstr     String    本次验证的随机串，后续票据校验时需传递该参数。
        console.log('callback:', res);


        // res（用户主动关闭验证码）= {ret: 2, ticket: null}
        // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
        // res（请求验证码发生错误，验证码自动返回terror_前缀的容灾票据） = {ret: 0, ticket: "String", randstr: "String",  errorCode: Number, errorMessage: "String"}
        // 此处代码仅为验证结果的展示示例，真实业务接入，建议基于ticket和errorCode情况做不同的业务处理
        if (res.ret === 0) {
            // 复制结果至剪切板
            var str = '【randstr】->【' + res.randstr + '】      【ticket】->【' + res.ticket + '】';
            // 获取div标签
            var resultDiv = document.getElementById("result");
            // 给div标签添加内容
            resultDiv.innerHTML = str;
            /*var ipt = document.createElement('input');
            ipt.value = str;
            document.body.appendChild(ipt);
            ipt.select();
            document.execCommand("Copy");
            document.body.removeChild(ipt);
            alert('1. 返回结果（randstr、ticket）已复制到剪切板，ctrl+v 查看。2. 打开浏览器控制台，查看完整返回结果。');*/
        }
    }


    // 定义验证码js加载错误处理函数
    function loadErrorCallback() {
        var appid = '20128';
        // 生成容灾票据或自行做其它处理
        var ticket = 'terror_1001_' + appid + '_' + Math.floor(new Date().getTime() / 1000);
        callback({
            ret: 0,
            randstr: '@' + Math.random().toString(36).substr(2),
            ticket: ticket,
            errorCode: 1001,
            errorMessage: 'jsload_error'
        });
    }


    // 定义验证码触发事件
    window.onload = function () {
        document.getElementById('CaptchaId').onclick = function () {
            try {
                // 生成一个验证码对象
                // CaptchaAppId：登录验证码控制台，从【验证管理】页面进行查看。如果未创建过验证，请先新建验证。注意：不可使用客户端类型为小程序的CaptchaAppId，会导致数据统计错误。
                //callback：定义的回调函数
                var captcha = new TencentCaptcha('20128', callback, {});
                // 调用方法，显示验证码
                captcha.show();
            } catch (error) {
                // 加载异常，调用验证码js加载错误处理函数
                loadErrorCallback();
            }
        }
    }
}
/**
 * YiDunSlider - demo
 * 
 */
function YiDunSlider(){
    console.log('YiDunSlider');
        var captchaIns;
        initNECaptcha({
            element: '#captchaYD',
            captchaId: 'eda6d7f57cf54b5d8f9b0ed24e5b6e66',//官方演示demo
            width: '320px',
            mode: 'popup',
            apiVersion: 2,
            popupStyles: {
                position: 'fixed',
                top: '20%'
            },
            onVerify: function (err, data) {
                /**
                 * 第一个参数是err（Error的实例），验证失败才有err对象
                 * 第二个参数是data对象，验证成功后的相关信息，data数据结构为key-value，如下：
                 * {
                 *   validate: 'xxxxx' // 二次验证信息
                 * }
                 **/
                if (err) return // 当验证失败时，内部会自动refresh方法，无需手动再调用一次
                /*var resultDiv = document.getElementById("result");

                // 给div标签添加内容
                resultDiv.innerHTML = `滑块返回result ${data['validate']}`;*/
                // 点击登录按钮后可调用服务端接口，以下为伪代码，仅作示例用
                /*$.ajax('/login', {
                    username: $('#username').val(),
                    password: $('#password').val(),
                    validate: data.validate,

                }, function onsuccess(data) {
                    // if (loginFail) {
                    // 密码错误等原因导致登录失败，业务上若需要刷新验证码，可调用refresh方法
                    //   captchaIns && captchaIns.refresh()
                    // } else {
                    // 登录成功后，相关处理逻辑
                    // }
                })*/
            }
        }, function onload(instance) {
            captchaIns = instance
        }, function onerror(err) {
            console.warn(err)
        })
        captchaIns && captchaIns.verify()
        /*var loginBtn = document.getElementById('CaptchaId')
        loginBtn.addEventListener('click', function () {
            captchaIns && captchaIns.verify()
            //captchaIns && captchaIns.refresh()
        })*/
}