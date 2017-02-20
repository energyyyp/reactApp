import React from 'react';
import ReactDOM from "react-dom";

var imageDatas=require("./data.json")
//获取图片路径 图片名信息转为路径信息
function generateImg(arr){
    for (var i=0;i<arr.length;i++){

        arr[i].imageUrl=require("./img/"+arr[i].filename);

    }
    return arr
};
//获取区间内的随机值
function getRangeRandom(low,peak){
    return Math.ceil(Math.random()*(peak-low)+low)

}
//获取0-30度之间的任意正负值
function getRotateRandom(low,peak){
    var degree;
    if(Math.random()>0.5) {
        degree= +Math.ceil(Math.random() * 30)
    }else{
        degree= -Math.ceil(Math.random() * 30)
    }
    return degree
}
var imagesDatas=generateImg(imageDatas)

var ImgFigure=React.createClass({
    //imgFigure点击函数
    handleClick(e){

        var self=this;
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();


    },
    render:function(){
        var styleObj={};
            //如果props属性中指定了这张图片的位置
            if(this.props.arrange.pos){
            styleObj=this.props.arrange.pos;
        }
        if(this.props.arrange.rotate){
            //兼容性
            var self=this;
            (["MozTransform","msTransform","WebkitTransform","transform"]).forEach(function (value) {
                styleObj[value]="rotate("+self.props.arrange.rotate+"deg)";
            })
            //styleObj["transform"]="rotate("+self.props.arrange.rotate+"deg)";
        }
        if(this.props.arrange.isCenter){
            styleObj["zIndex"]=11
        }
        var imgFigureClassName="figure";
        imgFigureClassName+=this.props.arrange.isInverse?" is-inverse":""
        return(
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
                <figcaption className="title">
                    <h4>{this.props.data.title}</h4>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>{this.props.data.title}</p>
                    </div>
                </figcaption>
            </figure>
        )
    }

});
var ControllerUnit=React.createClass({
    handleClick:function(e){
        if(this.props.arrange.isCenter){
            this.props.inverse()
        }else{
            this.props.center()
        }

        e.preventDefault();
        e.stopPropagation();
    },
    render:function(){
        var controllerClassName="controllerUnit";
        if(this.props.arrange.isCenter){
            controllerClassName+=" iscenter";
            if(this.props.arrange.isInverse){
                controllerClassName+=" isinverse"
            }
        }
        return(
            <span className={controllerClassName} onClick={this.handleClick}></span>
        );

    }
})

class App extends React.Component {
    constructor(props){
        super(props);
        this.state={
            imgsArrangeArr:[//图片状态，每个图片都是个状态对象
            {
                pos:{
                    left:'0',
                    top:'0'
                },
                rotate:0,
                isInverse:false,
                isCenter:false
            }
        ],
            Constant:{//初始化位置
                centerPos:{//中心图片
                    left:0,
                    right:0

                },
                hPosRange:{//水平方向的取值范围
                    leftSecX:[0,0],//左分区X的取值范围
                    rightSecX:[0,0],
                    y:[0,0]
                },
                vPosRange:{
                    x:[0,0],
                    topY:[0,0]
                }
            }

        }
    }

    componentDidMount(){//组件加载后初始化每张图片的值
    var stageDom=ReactDOM.findDOMNode(this.refs.stage);
    var stageW=stageDom.scrollWidth,stageH=stageDom.scrollHeight,
        halfStageW=Math.ceil(stageW/2),halfStageH=Math.ceil(stageH/2);

    var imgFigDom=ReactDOM.findDOMNode(this.refs.imageFigure0),
        imgW=imgFigDom.scrollWidth,imgH=imgFigDom.scrollHeight,
        halfImgW=Math.ceil(imgW/2),halfImgH=Math.ceil(imgH/2);

    this.state.Constant.centerPos={//中心图片的位置点
        left:halfStageW-halfImgW,
        top:halfStageH-halfImgH
    }
    //计算左侧右侧区域图片排布位置的取值范围
    this.state.Constant.hPosRange.leftSecX[0]=-halfImgW;
    this.state.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW*3;
    this.state.Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
    this.state.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
    this.state.Constant.hPosRange.y[0]=-halfImgH;
    this.state.Constant.hPosRange.y[1]=stageH-halfImgH;
    //计算上册区域图片排布位置范围
    this.state.Constant.vPosRange.topY[0]=-halfImgH;
    this.state.Constant.vPosRange.topY[0]=halfStageH-halfImgH*3;
    this.state.Constant.vPosRange.x[0]=halfStageW-imgW;
    this.state.Constant.vPosRange.x[1]=halfStageW;
    this.rearrange(0);
    }
    /*翻转图片函数
    * param 当前被翻转图片的在图片信息数组中的index
    * return {Function}这是一个闭包函数。期内return一个真正的待被执行的函数（即要进行的动画）
    * */
    inverse(index){
        var self=this;
        return function(){
            var imgsArrangeArr=self.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse
            self.setState({
                imgsArrangeArr:imgsArrangeArr
            })
        }
    }
    /*重新布局所有图片
    param：需放在图片中心位置的图片index*/
    rearrange(centerIndex){
        var imgsArrangeArr=this.state.imgsArrangeArr,
            constant=this.state.Constant,
            centerPos=constant.centerPos,
            hPosRange=constant.hPosRange,
            vPosRange=constant.vPosRange,
            hPosRangeLeftSecX=hPosRange.leftSecX,
            hPosRangeRightSecX=hPosRange.rightSecX,
            hPosRangeY=hPosRange.y,
            vPosRangeTopY=vPosRange.topY,
            vPosRangeX=vPosRange.x,
            imgsArrangeTopArr=[],//存储上侧图片区域
            topImgNum=Math.ceil(Math.random()*2),//取一个或者没有在上侧区域
            topImgSpliceIndex=0,//记录上侧图片区域的index
            //以上为初始化信息
        //居中中心图片 不需要旋转
            imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);//中心图片

            imgsArrangeCenterArr[0].pos=centerPos;
            imgsArrangeCenterArr[0].rotate=0;
            imgsArrangeCenterArr[0].isCenter=true;
        //取出要布局在上侧的图片状态信息,从imgsArrangeArr中随机取出需布局在上册的图片信息
        topImgSpliceIndex=Math.floor(Math.random()*imgsArrangeArr.length-topImgNum)//从剩余图片中随机选取一个index图片放在上侧
        imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum)//可能一个或0个

        //布局上侧图片
        imgsArrangeTopArr.forEach(function(value,index){
            value.pos={
                top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),//取取值之间的某一个值封装为函数
                left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            }
            value.rotate=getRotateRandom();
            value.isCenter=false;
        })
        //布局左右两侧图片
        for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
            var hPosLorX=null;
            if(i<k){
                hPosLorX=hPosRangeLeftSecX
            }else{
                hPosLorX=hPosRangeRightSecX
            }
            imgsArrangeArr[i].pos={
                top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                left:getRangeRandom(hPosLorX[0],hPosLorX[1])
            }
            imgsArrangeArr[i].rotate=getRotateRandom()
            imgsArrangeArr[i].isCenter=false;
        }
        if(imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])//将取出的上侧图片放回数组中
        }
        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0])
        this.setState({
            imgsArrangeArr:imgsArrangeArr
        })

    }
    /*
    * 利用rearrange函数居中对应index的图片
    * param index 需要被居中的图片对应的图片信息数组的index值
    * return {function}
    * */
    center(index){
        var self=this;
        return function(){
            self.rearrange(index)

        }
    }
    render() {
        var controllers=[],imgFigures=[];//实例数组
        var self=this;
        imagesDatas.forEach(function(value,index){
             if(!self.state.imgsArrangeArr[index]){//初始化状态对象
                self.state.imgsArrangeArr[index]={
                    pos:{
                        left:0,
                        top:0
                    },
                    rotate:0,
                    isInverse:false,
                    isCenter:false
                }
            }
            imgFigures.push(<ImgFigure key={index} data={value} ref={"imageFigure"+index} arrange={self.state.imgsArrangeArr[index]} inverse={self.inverse(index)} center={self.center(index)}/>);
            controllers.push(<ControllerUnit key={"controller"+index}arrange={self.state.imgsArrangeArr[index]} inverse={self.inverse(index)} center={self.center(index)}/>)
        });
       return (
           <section className="stage" ref="stage">
               <section className="imgSec">
                   {imgFigures}
               </section>
               <nav className="controller">
                   {controllers}
               </nav>
           </section>
       );
    }
}


export default App;