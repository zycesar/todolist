/*
* 1.手机桌面 meat  logo图片
* 2.上传git
* 3.curd(清除已完成)
* 4.动画都使用 animation:
* 5...
* */
$(function(){
    var todolist=[
        // {title:'向右滑动已移除便签',radius:0,isdel:0},
        // {title:'向左滑动启动更多选项',radius:0,isdel:0},
        // {title:'点击“+”添加',radius:0,isdel:0},
        // {title:'欢迎！',radius:0,isdel:0},
    ];
    if(localStorage.data){
        todolist=JSON.parse(localStorage.data);
        render();
    }else{
        localStorage.data=JSON.stringify(todolist);
    }
    function add(){
        todolist.push({
            title:'',
            radius:0,
            isdel:0
        });
        localStorage.data=JSON.stringify(todolist);
        render()
    }
    function  render(){
        $('.right').empty();
        $.each(todolist,function(i,v){
            $('<li><span>'+v.title+'</span></li>').addClass(function(){
                if(todolist[i].radius){
                    return 'del';
                }
            }).appendTo('.right');
        })
    }
    //添加
    $('.add').on('click',function(){
        add()
    });
    var left=null;
    $('.right').on('touchstart','li',function(e){
        left=e.originalEvent.changedTouches[0].pageX;
    });
    $('.right').on('touchmove','li',function(e){
        var newleft=e.originalEvent.changedTouches[0].pageX;
        if(newleft>left&&newleft-left>60){
            $(this).addClass('del');
            todolist[$(this).index()].radius=1;
            localStorage.data=JSON.stringify(todolist);
        }
        if(newleft<left&&left-newleft>60){
            $(this).removeClass('del');
            todolist[$(this).index()].radius=0;
            localStorage.data=JSON.stringify(todolist);
        }
        localStorage.data=JSON.stringify(todolist);
    });
    var move=null;
    $('.right').on('touchstart','.del',function(e){
        move=e.originalEvent.changedTouches[0].pageX;
        $('.right').on('touchmove','.del',function(e){
            var newmove=e.originalEvent.changedTouches[0].pageX;
            var x=newmove-move;
            if(x>280){
                $(this).addClass('move').delay(500).queue(function(){
                    $(this).remove().dequeue();
                    todolist.splice($(this).index(),1);
                    localStorage.data=JSON.stringify(todolist);
                })
            }
        });
    });
    //修改
    $('.right').on('touchend','li',function(){
        var input=$('<input>');
        input.focus();
        var lis=$(this);
        input.val(lis.find('span').text());
        lis.find('span').text('')
        input.appendTo(lis.find('span'));
        input.blur(function(){
            lis.find('span').text(input.val());
            $(this).remove();
            todolist[lis.index()].title=input.val();
            localStorage.data=JSON.stringify(todolist);
        })
        input.on('keydown',function(e){
            if(e.keyCode=='13'){
                lis.find('span').text(input.val());
                $(this).remove();
                todolist[lis.index()].title=input.val();
                localStorage.data=JSON.stringify(todolist);
            }

        })
    })
   // 删除所有
    $('.more').on('touchstart',function(){
        for(var i=0;i<todolist.length;i++){
            console.log(todolist[i].radius)
            if(todolist[i].radius){
                    // todolist.splice(i+1,1);
                // localStorage.data=JSON.stringify(todolist);
            }
        }


    })
});