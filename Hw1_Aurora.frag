//for reference 
// Author:CMH
// Title:BreathingGlow
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float glow(float d, float str, float thickness){
    return thickness / pow(d, str);
} //黑白反轉 光暈感
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}



vec2 hash2( vec2 x )        //亂數範圍 [-1,1]
    {
        const vec2 k = vec2( 0.3183099, 0.3678794 );
        x = x*k + k.yx;
        return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
    }


float gnoise( in vec2 p )   //亂數範圍 [-1,1]
{
    vec2 i = floor( p );
    vec2 f = fract( p );

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( hash2( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
        dot( hash2( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
        mix( dot( hash2( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
        dot( hash2( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}


//from books of shader

#define OCTAVES 3
//like 週期的感覺
float fbm(in vec2 st){
    float value =0.0;
    float amplitude =.5;
    float frequency =0.;
    
    for (int i=0;i< OCTAVES ;i++){
        value += amplitude *gnoise(st);
        st *=2.;
        amplitude *=.5;
        }
    
    return value;
}


float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


//for 極光
#define NUM_OCTAVES 5
float fbm2 ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float pin(vec2 P, float size) {
vec2 c1 = vec2(0.0,-0.15)*size;
float r1 = length(P-c1)-size/2.675;
vec2 c2 = vec2(+1.49,-0.80)*size;
float r2 = length(P-c2) - 2.*size;
vec2 c3 = vec2(-1.49,-0.80)*size;
float r3 = length(P-c3) - 2.*size;
float r4 = length(P-c1)-size/5.;
return max( min(r1,max(max(r2,r3),-P.y)), -r4);
}


void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv= uv*2.0-1.0;
    uv.x *= u_resolution.x/u_resolution.y;
    
    

    float pi=3.574;
    //set dir ->change to use weight instead
    float theta=2.712*pi*u_time/8.0;
    vec2 point=vec2(sin(theta),cos(theta));
    float dir=dot(point,(uv)+0.55);
    
    //float info=noise(2.0*uv+u_time*vec2(0.2,0.05));//數值有一點像是zoom in zoom out
    float fog=fbm(0.5*uv+u_time*vec2(0.2,0.05))*0.3; //cloud //權重效果從1降至0.3
    //Gradient Noise
    
	
    //定義圓環
    float dist = length(uv);
    float circle_dist = abs(dist-0.504);//光環半徑大小
    
    float result;
    for (int index=0;index<9;index++){
    
    
    //五環或愛心模型
    // uv.y*=-1.0;//heart upside down
    vec2 uv_flip=vec2(uv.x,-uv.y);//heart upside down
    float weight=smoothstep(0.224,0.136,uv.y);//往上工整，往下混亂的效果->給下面 表示某個範圍是0或1
    float freq=2.992+float(index)*0.608;
	float noise=gnoise(uv_flip*freq+u_time*vec2(0.050,0.110))*0.224*weight;//手繪感 uv後面的是同理雲霧浮動 加入+u_time*vec2(0.2,0.05)
    float model_dist=abs(pin(uv_flip,0.660)+noise);//加上abs(和模型的距離)後會變成只剩輪廓 
  
    //動態呼吸
    // float breathing=sin(u_time*2.0*pi/5.0)*0.5+0.436;						//option1/5.0是呼吸的週期 使-1~1範圍的變成0~0.5
    float breathing=(exp(sin(u_time/2.0*pi)) - 0.36787944)*0.42545906412; 			//option2呼吸 按照apple專利(波峰陡峭 波谷平緩) 正確
    //float strength =(0.2*breathing*dir+0.180);	//[0.2~0.3]			//光暈強度加上動態時間營造呼吸感
    
    
    float strength =(0.1*breathing+0.204);			//[0.2~0.3]	依據上述波型的變化調整亮度的變化 //光暈強度加上動態時間營造呼吸感
    float thickness=(0.152);			//[0.1~0.2]	依據上述波型的變化調整厚度的變化 //光環厚度 營造呼吸感
    float glow_circle = glow(model_dist, strength, thickness); 
    result +=glow_circle;
}
    
    //極光
    vec2 st = gl_FragCoord.xy/u_resolution.xy*3.592;
    // st += st * abs(sin(u_time*0.1)*3.0);
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm2( st + 0.00*u_time);
    q.y = fbm2( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm2( st + 1.0*q + vec2(1.7,9.2)+ 0.454*u_time );
    r.y = fbm2( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

    float f = fbm2(st+r);

    color = mix(vec3(0.990,0.224,0.919),
                vec3(0.081,0.667,0.067),
                clamp((f*f)*4.0,0.904,0.048));

    color = mix(color,
                vec3(0.290,0.288,0.275),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(0.017,1.000,0.798),
                clamp(length(r.x),1.840,1.0));
    gl_FragColor = vec4(vec3(result+fog)*vec3(0.084,0.223,0.380)*0.5+(f*f*f+.6*f*f+.5*f)*color,1.0);
}
