package com.example.app.model;

public class Merchant {
    private int id;
    private String name;
    private String business;

    public Merchant() {}

    public Merchant(int id, String name, String business) {
        this.id = id;
        this.name = name;
        this.business = business;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBusiness() {
        return business;
    }

    public void setBusiness(String business) {
        this.business = business;
    }
}
