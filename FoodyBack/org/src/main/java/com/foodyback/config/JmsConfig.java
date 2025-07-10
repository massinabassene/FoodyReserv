package com.foodyback.config;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.config.DefaultJmsListenerContainerFactory;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.support.converter.MappingJackson2MessageConverter;
import org.springframework.jms.support.converter.MessageConverter;
import org.springframework.jms.support.converter.MessageType;

/**
 * Configuration JMS pour ActiveMQ avec Railway.
 */
@Configuration
@EnableJms
public class JmsConfig {
    
    @Value("${spring.activemq.broker-url:tcp://activemq-classic.railway.internal:61616}")
    private String brokerUrl;
    
    @Value("${spring.activemq.user:admin}")
    private String username;
    
    @Value("${spring.activemq.password:admin}")
    private String password;
    
    @Bean
    public ActiveMQConnectionFactory connectionFactory() {
        ActiveMQConnectionFactory factory = new ActiveMQConnectionFactory();
        factory.setBrokerURL(brokerUrl);
        factory.setUserName(username);
        factory.setPassword(password);
        
        // Configuration pour Railway
        factory.setTrustAllPackages(true);
        factory.setUseAsyncSend(true);
        factory.setOptimizeAcknowledge(true);
        
        // Configuration de reconnexion
        factory.getRedeliveryPolicy().setMaximumRedeliveries(3);
        factory.getRedeliveryPolicy().setInitialRedeliveryDelay(1000);
        factory.getRedeliveryPolicy().setRedeliveryDelay(5000);
        
        return factory;
    }

    @Bean
    public JmsTemplate jmsTemplate() {
        JmsTemplate template = new JmsTemplate();
        template.setConnectionFactory(connectionFactory());
        template.setMessageConverter(jacksonJmsMessageConverter());
        template.setDeliveryPersistent(true);
        template.setSessionTransacted(true);
        return template;
    }

    @Bean
    public DefaultJmsListenerContainerFactory jmsListenerContainerFactory() {
        DefaultJmsListenerContainerFactory factory = new DefaultJmsListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory());
        factory.setMessageConverter(jacksonJmsMessageConverter());
        factory.setConcurrency("1-3"); // Augmenté pour Railway
        factory.setSessionTransacted(true);
        factory.setAutoStartup(true);
        
        // Configuration pour Railway
        factory.setErrorHandler(t -> {
            System.err.println("Erreur JMS: " + t.getMessage());
            t.printStackTrace();
        });
        
        return factory;
    }
    
    @Bean
    public MessageConverter jacksonJmsMessageConverter() {
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setTargetType(MessageType.TEXT);
        converter.setTypeIdPropertyName("_type");
        return converter;
    }
}