package com.iset.sistema_tickets.visual;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import com.iset.sistema_tickets.servicios.UsuarioService;
import com.iset.sistema_tickets.modelo.Usuario;

import org.springframework.context.ApplicationContext;

public class VentanaLogin extends JFrame {

    private UsuarioService usuarioService;
    private ApplicationContext context;

    // Componentes de la ventana
    private JTextField txtId = new JTextField(15);
    private JPasswordField txtPassword = new JPasswordField(15);
    private JButton btnLogin = new JButton("Ingresar");

    public VentanaLogin(UsuarioService usuarioService, ApplicationContext context) {
        this.usuarioService = usuarioService;
        this.context = context;
        setTitle("Sistema de Tickets - Login");
        setSize(300, 200);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new GridLayout(3, 2, 5, 5));

        // Diseño simple
        add(new JLabel("Usuario o Email:"));
        add(txtId);
        add(new JLabel("Contraseña:"));
        add(txtPassword);
        add(new JLabel(""));
        add(btnLogin);

        // Acción del botón
        btnLogin.addActionListener(this::ejecutarLogin);
    }

    private void ejecutarLogin(ActionEvent e) {
        try {
            if (txtId.getText().isEmpty() || txtPassword.getPassword().length == 0) {
                 JOptionPane.showMessageDialog(this, "Ingrese ID y contraseña", "Error", JOptionPane.WARNING_MESSAGE);
                 return;
            }

            String identifier = txtId.getText();
            String pass = new String(txtPassword.getPassword());

            Usuario user = usuarioService.login(identifier, pass);

            // Regla: Cambio de clave obligatorio
            if (user.isForzarCambio()) {
                String nueva = JOptionPane.showInputDialog(this, "Debe cambiar su clave inicial:");
                if (nueva != null && !nueva.isEmpty()) {
                    usuarioService.actualizarPassword(user.getId(), nueva);
                    JOptionPane.showMessageDialog(this, "Clave actualizada. Ingrese nuevamente.");
                    return;
                }
            }

            // Abrir ventana según el tipo
            abrirVentanaSegunTipo(user);
            this.dispose(); // Cerrar el login

        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Error de Login", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void abrirVentanaSegunTipo(Usuario user) {
        // Aquí llamarás a VentanaAdmin, VentanaTecnico, etc.
        JOptionPane.showMessageDialog(this, "Bienvenido " + user.getTipo());
    }
    
    public void mostrar() {
        setVisible(true);
    }
}
