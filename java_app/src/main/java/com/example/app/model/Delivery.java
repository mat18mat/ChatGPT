package com.example.app.model;

import java.util.List;

public class Delivery {
    private int id;
    private int clientId;
    private List<Integer> serviceIds;

    public Delivery() {}

    public Delivery(int id, int clientId, List<Integer> serviceIds) {
        this.id = id;
        this.clientId = clientId;
        this.serviceIds = serviceIds;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getClientId() {
        return clientId;
    }

    public void setClientId(int clientId) {
        this.clientId = clientId;
    }

    public List<Integer> getServiceIds() {
        return serviceIds;
    }

    public void setServiceIds(List<Integer> serviceIds) {
        this.serviceIds = serviceIds;
    }
}
