package com.example.app;

import com.example.app.ui.AppFrame;

import javax.swing.*;

public class MainApp {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new AppFrame().setVisible(true));
    }
}
