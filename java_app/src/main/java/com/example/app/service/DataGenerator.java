package com.example.app.service;

import com.example.app.model.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.javafaker.Faker;

import java.io.File;
import java.io.IOException;
import java.util.*;

public class DataGenerator {
    private final Faker faker = new Faker(Locale.FRENCH);
    private final ObjectMapper mapper = new ObjectMapper();
    private final Random random = new Random();

    public void generate(String dataDir) throws IOException {
        new File(dataDir).mkdirs();
        List<Client> clients = new ArrayList<>();
        List<Merchant> merchants = new ArrayList<>();
        List<Service> services = new ArrayList<>();
        List<Invoice> invoices = new ArrayList<>();
        List<Delivery> deliveries = new ArrayList<>();

        for (int i = 1; i <= 30; i++) {
            clients.add(new Client(i, faker.name().fullName(), faker.internet().emailAddress()));
            merchants.add(new Merchant(i, faker.company().name(), faker.company().profession()));
            services.add(new Service(i, faker.commerce().department(), faker.number().randomDouble(2, 10, 500)));
        }

        for (int i = 1; i <= 30; i++) {
            int clientId = random.nextInt(30) + 1;
            int merchantId = random.nextInt(30) + 1;
            List<Integer> serviceIds = pickServiceIds();
            invoices.add(new Invoice(i, clientId, merchantId, serviceIds));
        }

        for (int i = 1; i <= 30; i++) {
            int clientId = random.nextInt(30) + 1;
            List<Integer> serviceIds = pickServiceIds();
            deliveries.add(new Delivery(i, clientId, serviceIds));
        }

        mapper.writeValue(new File(dataDir + "/clients.json"), clients);
        mapper.writeValue(new File(dataDir + "/merchants.json"), merchants);
        mapper.writeValue(new File(dataDir + "/services.json"), services);
        mapper.writeValue(new File(dataDir + "/invoices.json"), invoices);
        mapper.writeValue(new File(dataDir + "/deliveries.json"), deliveries);
    }

    private List<Integer> pickServiceIds() {
        int count = random.nextInt(3) + 1;
        List<Integer> ids = new ArrayList<>();
        for (int j = 0; j < count; j++) {
            ids.add(random.nextInt(30) + 1);
        }
        return ids;
    }
}
