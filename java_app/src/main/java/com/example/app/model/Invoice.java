package com.example.app.model;

import java.util.List;

public class Invoice {
    private int id;
    private int clientId;
    private int merchantId;
    private List<Integer> serviceIds;

    public Invoice() {}

    public Invoice(int id, int clientId, int merchantId, List<Integer> serviceIds) {
        this.id = id;
        this.clientId = clientId;
        this.merchantId = merchantId;
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

    public int getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(int merchantId) {
        this.merchantId = merchantId;
    }

    public List<Integer> getServiceIds() {
        return serviceIds;
    }

    public void setServiceIds(List<Integer> serviceIds) {
        this.serviceIds = serviceIds;
    }
}
