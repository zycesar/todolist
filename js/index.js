/*
 * 1.手机桌面 meat  logo图片
 * 2.上传git
 * 3.curd(清除已完成)
 * 4.动画都使用 animation:
 * 5...
 * */
$(function () {
    var todolist = [
        // {title:'向右滑动已完成便签',radius:0,isdel:0},
        // {title:'再次向右滑动彻底移除便签',radius:0,isdel:0},
        // {title:'向左滑动取消移除',radius:0,isdel:0},
        // {title:'点击“+”添加',radius:0,isdel:0},
        // {title:'欢迎！',radius:0,isdel:0},
    ];
    var index=1;
    if (localStorage.data) {
        todolist = JSON.parse(localStorage.data);
        render();
    } else {
        localStorage.data = JSON.stringify(todolist);
    }

    function add() {
        // render()
        index++;
        if(index>7){index=1}
        var newli = $('<li><span><input type="text" class="newput"></span></li>');
        newli.addClass('back'+index).addClass('color'+index).addClass('newli').appendTo('.right').delay(500).queue(function(){
            $(this).removeClass('newli').dequeue()
        })
        var beinput=newli.find('span input');
        beinput.focus();
        beinput.blur(function(){
            newli.find('span').text($(this).val());
            if($(this).val().length>0){
                todolist.push({
                    title: $(this).val(),
                    radius: 0,
                    isdel: 0
                });
                localStorage.data = JSON.stringify(todolist);
            }else{
                 newli.addClass('init').delay(500).queue(function(){
                     $(this).removeClass('init').remove().dequeue();
                 });
            }
        })
    }

    function render() {

        $('.right').empty();
        $.each(todolist, function (i, v) {
            index++;
            if(index>7){index=1}
            $('<li><span>' + v.title + '</span></li>').addClass('color'+index).addClass('back'+index).addClass(function () {
                if (todolist[i].radius) {
                    return 'del';
                }
            }).appendTo('.right');
        })
    }

    //添加
    $('.add').on('click', function () {
        add()
    });
    var left = null;
    $('.right').on('touchstart', 'li', function (e) {
        left = e.originalEvent.changedTouches[0].pageX;
        $('.right').on('touchmove', 'li', function (e) {
            var newleft = e.originalEvent.changedTouches[0].pageX;
            if (newleft > left && newleft - left > 60) {
                $(this).addClass('del');
                todolist[$(this).index()].radius = 1;
                localStorage.data = JSON.stringify(todolist);
                return;
            }
            if (newleft < left && left - newleft > 60) {
                $(this).removeClass('del');
                todolist[$(this).index()].radius = 0;
                // localStorage.data=JSON.stringify(todolist);
            }
            localStorage.data = JSON.stringify(todolist);
        });
    });
    var move = null;
    var x = null;
    $('.right').on('touchstart', '.del', function (e) {
        move = e.originalEvent.changedTouches[0].pageX;
        $('.right').on('touchmove', '.del', function (e) {
            var newmove = e.originalEvent.changedTouches[0].pageX;
            x = newmove - move;
            if(x>0){
                $(this).css('transform', 'translateX(' + x + 'px)');
            }
        });
        $('.right').on('touchend', '.del', function (e) {
            if (x > 100) {
                $(this).addClass('move').delay(500).queue(function () {
                    $(this).remove().dequeue();
                    todolist.splice($(this).index(), 1);
                    localStorage.data = JSON.stringify(todolist);
                })
            } else {
                $(this).css('transform', 'translateX(0)')
            }
        })
    });
    //修改
    $('.right').on('touchend', 'li span', function () {
        if ($(this).find('input').length == 1) {
            return;
        }
        if ($(this).parent('li').hasClass('del')) {
            return;
        }
        var input = $('<input>');
        input.focus();
        var lis = $(this);
        input.val(lis.text());
        lis.text('');
        input.appendTo(lis);
        input.blur(function () {
            lis.text(input.val());
            $(this).remove();
            todolist[lis.closest('li').index()].title = input.val();
            localStorage.data = JSON.stringify(todolist);

        })
        input.on('keydown', function (e) {
            if (e.keyCode == '13') {
                lis.text(input.val());
                $(this).remove();
                todolist[lis.closest('li').index()].title = input.val();
                localStorage.data = JSON.stringify(todolist);
            }
        })
    })
    // 删除所有  循环里不要操作数组
    $('.more').on('touchstart', function () {
        var newArr = [];
        for (var i = 0; i < todolist.length; i++) {
            if (!todolist[i].radius) {
                newArr.push(todolist[i]);
            }
        }
        todolist = newArr;
        render()
        localStorage.data = JSON.stringify(todolist);
    })
});