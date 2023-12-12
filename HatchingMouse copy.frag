


// Author: CMH
// Title: Learning Shaders


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

float breathing=(exp(sin(u_time*2.0*3.14159/8.0)) - 0.36787944)*0.42545906412;
float mouseEffect(vec2 uv, vec2 mouse, float size) //座標位子 鼠標位子 大小
{
    float dist=length(uv-mouse);//shape
    return smoothstep(size, size+0.3*breathing, dist);  //size
}



void main()
{
    // ///**
    // vec2 mouse = u_mouse.xy;
    // // if mouse not detected do something
    // if(mouse.x <= 0.) mouse = vec2( u_resolution.x * (sin(u_time)+1.)/2., u_resolution.y * (cos(u_time)+1.) /2.);
    
    // // diameter of blob and intensity in same formula because why not
    // vec3 blob = vec3(.11-clamp(length((gl_FragCoord.xy-mouse.xy)/u_resolution.x),0.,.11))*2.;
 
    // vec3 stack= texture(u_tex0,gl_FragCoord.xy/u_resolution.xy).xyz * vec3(0.99,.982,.93);
    
    // fragColor = vec4(stack + blob, 1.0);
    // //**/
    
    vec2 uv= gl_FragCoord.xy/u_resolution.xy;
    vec2 vUv=fract(6.0*uv);                 //key?//會變成每個像素上??
    vec4 shadeColor= texture2D(u_tex0, uv); //取MonaLisa
    float shading= shadeColor.g;            //取MonaLisa綠色版作為明亮值
    float shading2= shadeColor.b;             //取MonaLisa B色版作為明亮值
    float shading3= shadeColor.r;             //取MonaLisa B色版作為明亮值


    vec2 mouse=u_mouse.xy/u_resolution.xy;
    
    float value=mouseEffect(uv,mouse,0.05);


    vec4 c;//混合過(處理過的--漸層銜接?)的紋理
                float step = 1. / 6.;
                if( shading <= step ){   
                    c = mix( texture2D( u_tex6, vUv ), texture2D( u_tex5, vUv ), 6. * shading );
                }
                if( shading > step && shading <= 2. * step ){
                    c = mix( texture2D( u_tex5, vUv ), texture2D( u_tex4, vUv) , 6. * ( shading - step ) );
                }
                if( shading > 2. * step && shading <= 3. * step ){
                    c = mix( texture2D( u_tex4, vUv ), texture2D( u_tex3, vUv ), 6. * ( shading - 2. * step ) );
                }
                if( shading > 3. * step && shading <= 4. * step ){
                    c = mix( texture2D( u_tex3, vUv ), texture2D( u_tex2, vUv ), 6. * ( shading - 3. * step ) );
                }
                if( shading > 4. * step && shading <= 5. * step ){
                    c = mix( texture2D( u_tex2, vUv ), texture2D( u_tex1, vUv ), 6. * ( shading - 4. * step ) );
                }
                if( shading > 5. * step ){
                    c = mix( texture2D( u_tex1, vUv ), vec4( 1. ), 6. * ( shading - 5. * step ) );
                }
                
        vec4 c2;//混合過(處理過的--漸層銜接?)的紋理
                // float step = 1. / 6.;
                if( shading2 <= step ){   
                    c2 = mix( texture2D( u_tex6, vUv ), texture2D( u_tex5, vUv ), 6. * shading2 );
                }
                if( shading2 > step && shading2 <= 2. * step ){
                    c2 = mix( texture2D( u_tex5, vUv ), texture2D( u_tex4, vUv) , 6. * ( shading2 - step ) );
                }
                if( shading2 > 2. * step && shading2 <= 3. * step ){
                    c2 = mix( texture2D( u_tex4, vUv ), texture2D( u_tex3, vUv ), 6. * ( shading2 - 2. * step ) );
                }
                if( shading2 > 3. * step && shading2 <= 4. * step ){
                    c2 = mix( texture2D( u_tex3, vUv ), texture2D( u_tex2, vUv ), 6. * ( shading2 - 3. * step ) );
                }
                if( shading2 > 4. * step && shading2 <= 5. * step ){
                    c2 = mix( texture2D( u_tex2, vUv ), texture2D( u_tex1, vUv ), 6. * ( shading2 - 4. * step ) );
                }
                if( shading2 > 5. * step ){
                    c2 = mix( texture2D( u_tex1, vUv ), vec4( 1. ), 6. * ( shading2 - 5. * step ) );
                }

        vec4 c3;//混合過(處理過的--漸層銜接?)的紋理
                // float step = 1. / 6.;
                if( shading3 <= step ){   
                    c3 = mix( texture2D( u_tex6, vUv ), texture2D( u_tex5, vUv ), 6. * shading3 );
                }
                if( shading3 > step && shading3 <= 2. * step ){
                    c3 = mix( texture2D( u_tex5, vUv ), texture2D( u_tex4, vUv) , 6. * ( shading3 - step ) );
                }
                if( shading3 > 2. * step && shading3 <= 3. * step ){
                    c3 = mix( texture2D( u_tex4, vUv ), texture2D( u_tex3, vUv ), 6. * ( shading3 - 2. * step ) );
                }
                if( shading3 > 3. * step && shading3 <= 4. * step ){
                    c2 = mix( texture2D( u_tex3, vUv ), texture2D( u_tex2, vUv ), 6. * ( shading3 - 3. * step ) );
                }
                if( shading3 > 4. * step && shading3 <= 5. * step ){
                    c2 = mix( texture2D( u_tex2, vUv ), texture2D( u_tex1, vUv ), 6. * ( shading3 - 4. * step ) );
                }
                if( shading3 > 5. * step ){
                    c2 = mix( texture2D( u_tex1, vUv ), vec4( 1. ), 6. * ( shading3 - 5. * step ) );
                }
     vec4 inkColor = vec4(0.0, 0.0, 1.0, 1.0);
     vec4 src = mix(mix( inkColor, vec4(255.   , 0., 138.,1.), c.r ), c, .9);//權重越大越靠近前面的效果//mix讓效果更逼近原本的不要那麼跳
    vec4 src2 = mix(mix( inkColor, vec4(196., 249., 46.,1.), c2.g ), c2, .9);//權重越大越靠近前面的效果//mix讓效果更逼近原本的不要那麼跳
    vec4 src3 = mix(mix( inkColor, vec4(46., 199., 255.,1.), c3.b ), c3, .9);//權重越大越靠近前面的效果//mix讓效果更逼近原本的不要那麼跳
    vec4 merge =(src+src2+src3)*0.03 ;
     vec4 mixColor = mix(shadeColor, merge, value);
     gl_FragColor =mixColor;

}
