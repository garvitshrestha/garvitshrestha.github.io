jQuery(document).ready((function($){$(".btn-display-main-content").click((function(e){e.preventDefault(),$("body").addClass("body-class"),$(".main-content-wrapper").fadeIn(2e3),$(".initial-display").remove()}));var targetDate=new Date("2019/12/1 00:00:00"),days,hrs,min,sec;function timeToLaunch(){var currentDate,diff=(new Date-targetDate)/1e3,diff=Math.abs(Math.floor(diff));days=Math.floor(diff/86400),sec=diff-24*days*60*60,hrs=Math.floor(sec/3600),sec-=60*hrs*60,min=Math.floor(sec/60),sec-=60*min}function countDownTimer(){timeToLaunch(),$("#days .number").text(days),$("#hours .number").text(hrs),$("#minutes .number").text(min),$("#seconds .number").text(sec),0==days&&0==hrs&&0==min&&0==sec&&($("ul#countdown").remove(),$(".container").removeAttr("style")),setTimeout(countDownTimer,1e3)}function numberTransition(id,endPoint,transitionDuration,transitionEase){$({numberCount:$(id).text()}).animate({numberCount:endPoint},{duration:transitionDuration,easing:transitionEase,step:function(){$(id).text(Math.floor(this.numberCount))},complete:function(){$(id).text(this.numberCount)}})}$((function(){timeToLaunch(),numberTransition("#days .number",days,1e3,"easeOutQuad"),numberTransition("#hours .number",hrs,1e3,"easeOutQuad"),numberTransition("#minutes .number",min,1e3,"easeOutQuad"),numberTransition("#seconds .number",sec,1e3,"easeOutQuad"),setTimeout(countDownTimer,1001)})),$(".select-btn-heart-false").click((function(e){e.preventDefault(),alert("Sorry dear... This is not the right one.")})),$(".select-btn-heart-true").click((function(e){e.preventDefault(),alert("Yeah.... ✨✨✨ You got it. Now sit back and enjoy this song, our favourite song; 😁"),$("#youtube-player-wrapper").removeAttr("style"),$("#closing-section").removeAttr("style")}))}));