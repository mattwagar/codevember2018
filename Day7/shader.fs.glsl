precision mediump float;

struct DirectionalLight
{
    vec3 direction;
    vec3 color;
};

varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform vec3 ambientLightIntensity;
uniform DirectionalLight sun;
uniform sampler2D sampler;

void main()
{
//    gl_FragColor = texture2D(sampler, fragTexCoord);
    // vec3 ambientLightIntensity = vec3(0.3, 0.3, 0.3);
    // vec3 sunlightIntensity = vec3(0.6, 0.6, 0.6);
    // vec3 sunlightDirection = normalize(vec3(1.0, 4.0, 2.0));
    vec3 surfaceNormal = normalize(fragNormal);
    vec4 texel = texture2D(sampler, fragTexCoord);
    vec3 normSunDir = normalize(sun.direction);

    vec3 lightIntensity = ambientLightIntensity + sun.color * max(dot(surfaceNormal, normSunDir), 0.0);

    gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
}