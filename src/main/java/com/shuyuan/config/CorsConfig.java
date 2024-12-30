package com.shuyuan.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;


@Configuration
public class CorsConfig {

    /**
     * 创建并注册CORS过滤器的Bean。
     * 该方法配置了CORS策略，并注册了一个CORS过滤器Bean到Spring容器中。
     *
     * @return 返回配置好的CORS过滤器。
     */
    @Bean
    public CorsFilter corsFilter() {
        // 创建CORS配置实例
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        // 允许所有来源
        corsConfiguration.addAllowedOrigin("*");
        // 允许所有请求头
        corsConfiguration.addAllowedHeader("*");
        // 允许所有HTTP方法
        corsConfiguration.addAllowedMethod("*");

        // 创建基于URL的CORS配置源
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 为所有路径注册CORS配置
        source.registerCorsConfiguration("/**", corsConfiguration);

        // 创建并返回CORS过滤器
        return new CorsFilter(source);
    }
}

