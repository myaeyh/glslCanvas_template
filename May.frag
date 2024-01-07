//一開始沒有塗 先看作品介紹
//texture20 or play
//picture不便
//x-axis=0 Y axis=0.05
//還沒cursor時就是沒有RGB色板
//ink 000 background
#ifdef GL_ES
precision mediump float;
#endif

vec2 uv;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform float u_density_texture;
uniform float u_density_picture;

uniform float u_speed_x;
uniform float u_speed_y;
uniform bool u_still;
uniform bool u_mouse_pressed;

uniform vec3 u_rgb;

uniform vec3 u_color_ink;
uniform vec3 u_color_background;

uniform sampler2D u_texture_base;
uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_3;
uniform sampler2D u_texture_4;
uniform sampler2D u_texture_5;

uniform sampler2D u_title;//左下那個大字還沒cursor之前
uniform sampler2D u_guide;//左哨角得

uniform sampler2D u_intro_background;//作品說明
uniform sampler2D u_intro_title;
uniform sampler2D u_intro_content;

#define PI 3.1415926535897932384626433832795

// -------------------- hash -------------------- //
//生成擾動數值的 hash 函數->生成噪聲&複雜紋理的時候使用<-隨機性
//使用 sin 函數生成一個週期性的值，並乘以一個大數值（40000.0）以放大影響
//fract 函數用於取得 sin(n) * 40000.0 的小數部分，將結果限制在 [0, 1] 的範圍內
float hash(in float n)
{
    return fract(sin(n) * 40000.0);
}

// -------------------- random2 -------------------- //
//目的：在二維空間中生成擾動的向量->常用於創建隨機模式或引入變動，ex生成噪聲紋理或其他複雜的圖形
//CODE：使用 sin 和 dot 函數生成兩個擾動值，每個擾動值都是通過 dot 乘積計算的
    // 使用不同常數向量（vec2(127.1, 311.7) 和 vec2(269.5, 183.3)）區分不同的擾動
    // 將這兩個擾動值傳入 sin 函數中，並乘以一個大數值（43758.5453）
    // 最後使用 fract 函數取得 sin(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))) * 43758.5453 的小數部分->[0,1]
vec2 random2(vec2 p)
{
    return fract(sin(vec2(dot(p,vec2(127.1, 311.7)),
                                   dot(p,vec2(269.5, 183.3)))) * 43758.5453);
}

// -------------------- voronoi -------------------- //
//會用到的程式碼被註解掉了

vec3 voronoi(in vec2 x)
{
    vec2 n = floor(x);
    vec2 f = fract(x);

    vec2 mg, mr;
    float md = 8.0;
    for (int j = -1; j <= 1; j++)
    {
        for (int i = -1; i <= 1; i++)
        {
            vec2 g = vec2(float(i), float(j));
            vec2 o = random2(n + g);
            o = 0.5 + 0.5 * sin(u_time + 6.2831 * o);

            vec2 r = g + o - f;
            float d = dot(r,r);

            if( d < md ) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    md = 8.0;
    for (int j = -2; j <= 2; j++)
    {
        for (int i = -2; i <= 2; i++)
        {
            vec2 g = mg + vec2(float(i), float(j));
            vec2 o = random2(n + g);
            o = 0.5 + 0.5 * sin(u_time + 6.2831 * o);

            vec2 r = g + o - f;

            if (dot(mr-r, mr-r) > 0.00001)
            {
                md = min(md, dot(0.5 * (mr + r), normalize(r - mr)));
            }
        }
    }
    return vec3(md, mr);
}

// -------------------- colorTransform -------------------- //

vec3 colorTransform(vec3 color)
{
    color.xyz /= 255.0;//改這裡滑鼠沒差
    return color;
}

// -------------------- mouseEffect -------------------- //

// float mouseEffect(vec2 uv, vec2 mouse, float size)
// {
//     float dist = length(uv - mouse);
//     return smoothstep(size, size, dist);
// }

float breathing=(exp(sin(u_time*2.0*3.14159/8.0)) - 0.36787944)*0.42545906412;
float mouseEffect(vec2 uv, vec2 mouse, float size)
{
    // size = 0.01 * min(u_resolution.x, u_resolution.y);
    float dist=length(uv-mouse);
    return smoothstep(size, size+0.2*(breathing+0.5), dist);  //size
}

// -------------------- main -------------------- //

void main()
{
    uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;
    //寬高比???這樣的調整確保了在不同寬高比的屏幕上，UV坐標的X分量被縮放，使得紋理或效果在視覺上看起來正確，不會因為寬高比的變化而變形

    vec2 uv_mouse = u_mouse / u_resolution.xy; //通過除以屏幕的分辨率( u_resolution.xy包含屏幕分辨率的統一變量)，將滑鼠位置轉換為規範化的坐標系，即在 [0, 1] 的範圍內。
    uv_mouse.x *= u_resolution.x / u_resolution.y;

    float highlight_size = 0.02;//滑鼠高光筆
    float texture_mouse = mouseEffect(uv, uv_mouse, highlight_size*-sin(u_time));//因為光暈的跟呼吸效果可能會打架

//u_title是從js設定字體的左下角的自，在texturetitle的地方使用到u_title
    vec2 uv_title = vec2(uv.x , uv.y );//存儲新的紋理座標。在原始的紋理座標基礎上，向右偏移了 0.45，向上偏移了 0.45。這可能是為了定位紋理中的某個區域，使其在視覺上更好地顯示在屏幕上的特定位置。
    uv_title.y = 1.0 - uv_title.y;//因為店腦座標的方向相反??
	vec4 texture_title = texture2D(u_title, uv_title);
//u_guide是左上的cursor
    vec2 uv_guide = vec2(uv.x + 0.45, uv.y - 0.45);//是否是他最低就是0.45
    uv_guide.y = 1.0 - uv_guide.y;
	vec4 texture_guide = texture2D(u_guide, uv_guide);

    vec2 uv_intro_background = uv;
    vec4 texture_intro_background = texture2D(u_intro_background, uv_intro_background);

    vec2 uv_intro_title = vec2(uv.x + 0.45, uv.y + 0.45);
    uv_intro_title.y = 1.0 - uv_intro_title.y;
	vec4 texture_intro_title = texture2D(u_intro_title, uv_intro_title);

    vec2 uv_intro_content = vec2(uv.x + 0.45, uv.y - 0.45);
    uv_intro_content.y = 1.0 - uv_intro_content.y;
	vec4 texture_intro_content = texture2D(u_intro_content, uv_intro_content);

    if (u_still) { uv = uv; }//是否移動
    else
    {
        uv.x -= u_time * u_speed_x;
        uv.y -= u_time * u_speed_y;
    }

    vec4 graphic;

    // -------------------------------------------------- //

    // vec2 uv_graphic = uv * 3.0;
    // vec3 graphic_voronoi = voronoi(uv_graphic);

    // graphic.rgb = graphic_voronoi.x * (0.5 + 0.5 * sin(64.0 * graphic_voronoi.x)) * vec3(1.0);
    // graphic.rgb = mix(vec3(1.0),
    //                   graphic.rgb,
    //                   smoothstep(0.1, 0.02, graphic_voronoi.x));

    // -------------------------------------------------- //

    // vec2 uv_graphic = uv * 6.0;

    // vec2 i_st = floor(uv_graphic);
    // vec2 f_st = fract(uv_graphic);

    // float m_dist = 1.;
    // for (int j = -1; j <= 1; j++)
    // {
    //     for (int i = -1; i <= 1; i++)
    //     {
    //         vec2 neighbor = vec2(float(i), float(j));

    //         vec2 offset = random2(i_st + neighbor);
    //         offset = 0.5 + 0.5 * sin(u_time + 6.2 * offset);

    //         vec2 pos = neighbor + offset - f_st;

    //         float dist = length(pos);

    //         m_dist = min(m_dist, m_dist * dist);
    //     }
    // }

    // graphic += step(0.060, m_dist);

    // -----產生一個密度紋理的網格坐標??--------------------------------------------- //

    vec2 uv_texture = fract(floor(u_density_texture) * uv);//?
    //將 u_density_texture 中的值向下取整，得到最接近且小於 u_density_texture 的整數值。這將產生一個密度紋理的網格坐標。
    //fract(...) * uv：將上一步得到的網格坐標進行 fract 函數運算，得到該網格內的相對坐標（小數部分）。然後，將這個相對坐標與原始的紋理座標 uv 相乘。
    
    //------------rgb色板取樣向關?-------------
    float shading;

    if (u_rgb.r == 1.0) { shading += texture2D(u_texture_base, fract(floor(u_density_picture) * uv)).r; }
    if (u_rgb.g == 1.0) { shading += texture2D(u_texture_base, fract(floor(u_density_picture) * uv)).g; }
    if (u_rgb.b == 1.0) { shading += texture2D(u_texture_base, fract(floor(u_density_picture) * uv)).b; }

    // if (u_rgb.r == 1.0) { shading += graphic.r; }
    // if (u_rgb.g == 1.0) { shading += graphic.g; }
    // if (u_rgb.b == 1.0) { shading += graphic.b; }
    
    if (u_rgb.r + u_rgb.g + u_rgb.b >= 1.0) { shading /= u_rgb.r + u_rgb.g + u_rgb.b; }
    else { shading = 1.0; }
    //歸一化：如果 u_rgb 中的任何一個通道為1.0，即任何通道影響了 shading，那麼將 shading 除以所有通道的總和，以實現歸一化。
    //如果所有通道的總和小於1.0，則將 shading 設為1.0。這樣的操作可能是為了確保 shading 的值處於一個合理的範圍內，並受到各通道的影響。
    //---------------老師的模板--------------
    vec4 texture;

    float step = 1.0 / 6.0;

    if (shading <= step)
    {
        texture = texture2D(u_texture_5, uv_texture);
    }
    if (shading > step && shading <= 2.0 * step)
    {
        texture = texture2D(u_texture_4, uv_texture);
    }
    if (shading > 2.0 * step && shading <= 3.0 * step)
    {
        texture = texture2D(u_texture_3, uv_texture);
    }
    if (shading > 3.0 * step && shading <= 4.0 * step)
    {
        texture = texture2D(u_texture_2, uv_texture);
    }
    if (shading > 4.0 * step && shading <= 5.0 * step)
    {
        texture = texture2D(u_texture_1, uv_texture);
    }
    if (shading > 5.0 * step)
    {
        texture = texture2D(u_texture_0, uv_texture);
    }

    // -------------------------------------------------- //

//滑鼠附近產生顏色過渡。
//根據 texture_mouse 值產生一插值效果
    vec4 color_ink = vec4(colorTransform(u_color_ink), 1.0);//正規畫??
    vec4 color_background = vec4(colorTransform(u_color_background), 1.0);//正規畫??

    vec4 shader_mouse = mix(mix(color_background, color_ink, texture), 
                            mix(color_ink, color_background, texture),
                            texture_mouse);//?應該是條顏色

    // vec4 shader_title = mix(mix(color_ink, color_background, texture), 
    //                         mix(color_background, color_ink, texture),
    //                         texture_title);

    // vec4 shader_guide = mix(mix(color_ink, color_background, texture), 
    //                         mix(color_background, color_ink, texture),
    //                         texture_guide);

    vec4 shader_title = mix(vec4(0.0, 0.0, 0.0, 0.0), 
                            color_ink,
                            texture_title);

    vec4 shader_guide = mix(vec4(0.0, 0.0, 0.0, 0.0), 
                            color_ink,
                            texture_guide);

    vec4 shader_intro_background = mix(vec4(0.0, 0.0, 0.0, 0.0),
                                       color_ink,
                                       texture_intro_background);

    vec4 shader_intro_title = mix(vec4(0.0, 0.0, 0.0, 0.0),
                                       color_background,
                                       texture_intro_title);

    vec4 shader_intro_content = mix(vec4(0.0, 0.0, 0.0, 0.0),
                                    color_background,
                                    texture_intro_content);

//進去的畫面
    vec4 shader = mix(shader_mouse, shader_title, texture_title);//疊合滑鼠跟背景?
    shader = mix(shader, shader_guide, texture_guide);//呈上，疊合
//進去+被cursor的畫面
    vec4 shader_intro = mix(shader, shader_intro_background, texture_intro_background);
    shader_intro = mix(shader_intro, shader_intro_title, texture_intro_title);
    shader_intro = mix(shader_intro, shader_intro_content, texture_intro_content);
//滑鼠位子互動
    if (uv_mouse.x <= 0.1) { gl_FragColor = shader_intro; }
    else { gl_FragColor = shader; }
}