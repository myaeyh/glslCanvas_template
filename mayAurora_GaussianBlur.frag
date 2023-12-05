// Author: @patriciogv
// Title: 4 cells voronoi
//眼眶泛淚的效果->清晰底圖 會突然脹滿 中間跟著模糊掉 V
//修改畫布的大小時還是要符合這個東西，不是東西變多是整個一起變大!
//邊緣想要柔化!(光暈效果)
//橢圓形狀在中間--半透明(光暈效果) 
//周圍是這個cellular隨時間錯落閃現
//底圖-->懷念的事情真的就是家人
//滑鼠過去就變清楚的效果-->還沒想到意義
//麻布材質在中間


#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
uniform sampler2D u_tex3;
uniform sampler2D u_tex4;
uniform sampler2D u_tex5;
uniform sampler2D u_tex6;
// 卷积大小->高斯模糊
const int KernelSize = 9;

//Cellular noise
vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
    float stepValue = 0.005;
    
    vec2 st = gl_FragCoord.xy / u_resolution.xy;//for shader
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;//for picture
    float shading= texture2D(u_tex1, uv).r;
	 vec3 color = vec3(.0);//雖然疊圖之後顏色就會被蓋掉但也不能省
    
    // color += step(.5, m_dist);
    // color += mix(vec3(0.075,0.114,0.329),vec3(0.845,0.732,0.586),m_dist*0.0001);

    float step =1./6.;
    if(shading<=step){
        stepValue = 0.0;//monalisa's blur step
    }
    if( shading > step && shading <= 2. * step ){
        stepValue = 0.01;
    }
    if( shading > 2. * step && shading <= 3. * step ){
		stepValue = 0.5;
        
    }   
    // if( shading > 3. * step && shading <= 4. * step ){
	// 	stepValue = 0.0;
    // }
    
    // if( shading > 4. * step && shading <= 5. * step ){
    //     stepValue = 0.;
    // }
    // if( shading > 5. * step ){
    //     stepValue = 0.5;
    // }
    
    
    // }
    // else{

    // }
    


//高斯模糊，移動到下面stepValue的值才能在celluarnoise那塊改變(因為後面有fstep會取用這個東西:0)
    vec4 sum = vec4(0.0);
    
    //用来存储3x3的卷积矩阵
    float Kernel[KernelSize];
    Kernel[6] = 1.0; Kernel[7] = 2.0; Kernel[8] = 1.0;
    Kernel[3] = 2.0; Kernel[4] = 4.0; Kernel[5] = 2.0;
    Kernel[0] = 1.0; Kernel[1] = 2.0; Kernel[2] = 1.0;
    
     
    float fStep = stepValue;
    //像素点偏移位置
    vec2 Offset[KernelSize];
    Offset[0] = vec2(-fStep,-fStep); Offset[1] = vec2(0.0,-fStep); Offset[2] = vec2(fStep,-fStep);
    Offset[3] = vec2(-fStep,0.0);    Offset[4] = vec2(0.0,0.0);    Offset[5] = vec2(fStep,0.0);
    Offset[6] = vec2(-fStep, fStep); Offset[7] = vec2(0.0, fStep); Offset[8] = vec2(fStep, fStep);
    
    for (int i = 0; i < KernelSize; i++)
    {
        vec4 tmp = texture2D(u_tex1, uv + Offset[i]);
        sum += tmp * Kernel[i];
    }
    gl_FragColor = sum/16.0+vec4(color,1.);

}


// 作者：JulyYu
// 链接：https://juejin.cn/post/7059618164555907079
