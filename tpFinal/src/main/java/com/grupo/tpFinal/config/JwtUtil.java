package com.grupo.tpFinal.config;

import com.grupo.tpFinal.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;

    @Component
    public class JwtUtil {

        private static final String SECRET = "mi_clave_super_secreta_jwt_2025_tp_final";

        public String generarToken(Usuario usuario) {
            return Jwts.builder()
                    .setSubject(usuario.getEmail())
                    .claim("rol", usuario.getRol().name())
                    .claim("id", usuario.getId())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 4)) // 4h
                    .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()), SignatureAlgorithm.HS256)
                    .compact();
        }

        public Claims obtenerClaims(String token) {
            return Jwts.parserBuilder()
                    .setSigningKey(SECRET.getBytes())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }
    }

