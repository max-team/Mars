/**
 * @file utils
 * @Date 2019/2/21
 * @author zhaolongfei(izhaolongfei@gmail.com)
 */

export function loadScript(url) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.type = 'text/javascript';

        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    resolve();
                }

            };
        }
        else {
            script.onload = function () {
                resolve();
            };
        }

        script.onerror = function (e) {
            reject(e);
        };

        script.src = url;
        document.body.appendChild(script);
    });
}
