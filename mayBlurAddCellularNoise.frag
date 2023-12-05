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
    float amplitude=0.5*sin(u_time)+0.59;//再小的話會出現太多小油滴:(

    vec2 st = gl_FragCoord.xy / u_resolution.xy;//for shader
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;//for picture
//'''CC
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(.0);//雖然疊圖之後顏色就會被蓋掉但也不能省
    // Scale
    st *= 3.;
    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
//'''CC    
    
    
//'''CC    
    float m_dist = 1.;  // minimum distance
    
    // float movinysty=abs(sin(u_time)*1.5-2.)-st.y*0.5;//很怪!
    // if(movinysty<1.||movinysty>2.){//haven't done
    
    // if(st.y<1.||st.y>2.){ //原本想做遮罩但發現做不出來
        
    for (int j= -1; j <= 1; j++ ) {
        for (int i= -1; i <= 1; i++ ) {
            // Neighbor place in the grid當前迭代的鄰居在瓦片中的位置
            vec2 neighbor = vec2(float(i),float(j));

            // Random position from current + neighbor place in the grid
            vec2 offset = random2(i_st + neighbor);

            // Animate the offset //adjust cell speed
            offset =0.5+0.5*sin(0.352*u_time + 6.2831*offset);

            // Position of the cell
//*****假设 neighbor + offset 在格子中的位置是 (0.8, 0.3)，而 f_st 是当前瓦片的小数部分 (0.4, 0.2)，那么减去 f_st 后的 pos 就是 (0.4, 0.1)，这是相对于当前瓦片的局部坐标。
//这种调整确保了在 metaballs 的计算中，所有的相对位置都是相对于当前瓦片的，从而使 metaballs 效果在每个瓦片内部都是正确的。
			vec2 pos = neighbor + offset - f_st;

            // Cell distance單元格到原點的距離 dist
            float dist = length(pos);

            // Metaball it!
						//m_dist 更新為當前最小距離。這樣，最終的 m_dist 將包含在九個鄰居中的最小距離，形成 metaballs 的效果。
            m_dist = min(m_dist, m_dist*dist);
        }
    }
    
    // Draw cells
		//m_dist 小于阈值 0.060，那么阶梯函数返回1，color 就会增加1。
		//否则，返回0，color 不变。
    
    color += step(amplitude, m_dist);
    stepValue = amplitude*0.01;//monalisa's blur step
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
        vec4 tmp = texture2D(u_tex0, uv + Offset[i]);
        sum += tmp * Kernel[i];
    }
    gl_FragColor = sum/16.0+vec4(color,1.);

}


// 作者：JulyYu
// 链接：https://juejin.cn/post/7059618164555907079
