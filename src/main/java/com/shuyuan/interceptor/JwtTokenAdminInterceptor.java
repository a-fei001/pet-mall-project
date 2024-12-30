package com.shuyuan.interceptor;





import com.shuyuan.context.BaseContext;
import com.shuyuan.properties.JwtProperties;
import com.shuyuan.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * jwt令牌校验的拦截器
 */
@Component
@Slf4j
public class JwtTokenAdminInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtProperties jwtProperties;

    /**
     * 校验jwt
     *
     * @param request
     * @param response
     * @param handler
     * @return
     * @throws Exception
     */
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //判断当前拦截到的是Controller的方法还是其他资源
        if (!(handler instanceof HandlerMethod)) {
            //当前拦截到的不是动态方法，直接放行
            return true;
        }

        //1、从请求头中获取令牌
        String token = request.getHeader(jwtProperties.getAdminTokenName());

        //2、校验令牌
        try {
            log.info("jwt校验:{}", token);
            //JwtUtil.parseJWT(,请求头携带的token)
            Claims claims = JwtUtil.parseJWT(jwtProperties.getAdminSecretKey(), token);
            Long empId = Long.valueOf(claims.get("userId").toString());
            log.info("当前员工id：{}", empId);

            //新增用户时 需要填写用户的创建人id 最终修改人id
            //这个id在生成JWT令牌时加入了 这里从令牌中解析出来
            //BaseContext 使用ThreadLocal类 ThreadLocal为每个线程提供单独一份存储空间，具有线程隔离的效果，
            //                             只有在线程内才能获取到对应的值，线程外则不能访问。
            //逻辑：新增请求--*验证JWT--得到本次操作用户的id存入ThreadLocal*--在Service处存入
            BaseContext.setCurrentId(empId);

            //3、通过，放行
            return true;
        } catch (Exception ex) {
            //4、不通过，响应401状态码
            response.setStatus(401);
            return false;
        }
    }
}
