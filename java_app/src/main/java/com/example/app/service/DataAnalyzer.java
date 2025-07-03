package com.example.app.service;

import com.example.app.model.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

public class DataAnalyzer {
    private final ObjectMapper mapper = new ObjectMapper();

    private List<Client> clients;
    private List<Merchant> merchants;
    private List<Service> services;
    private List<Invoice> invoices;
    private List<Delivery> deliveries;

    public List<Invoice> getInvoices() {
        return invoices;
    }

    public void load(String dataDir) throws IOException {
        clients = mapper.readValue(new File(dataDir + "/clients.json"), new TypeReference<>() {});
        merchants = mapper.readValue(new File(dataDir + "/merchants.json"), new TypeReference<>() {});
        services = mapper.readValue(new File(dataDir + "/services.json"), new TypeReference<>() {});
        invoices = mapper.readValue(new File(dataDir + "/invoices.json"), new TypeReference<>() {});
        deliveries = mapper.readValue(new File(dataDir + "/deliveries.json"), new TypeReference<>() {});
    }

    public double computeRevenue() {
        double revenue = 0;
        for (Invoice inv : invoices) {
            for (int sid : inv.getServiceIds()) {
                Service s = services.get(sid - 1);
                revenue += s.getPrice();
            }
        }
        return revenue;
    }

    public List<Client> topClients() {
        Map<Integer, Long> counts = invoices.stream()
                .collect(Collectors.groupingBy(Invoice::getClientId, Collectors.counting()));
        return counts.entrySet().stream()
                .sorted(Map.Entry.<Integer, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> clients.get(e.getKey() - 1))
                .collect(Collectors.toList());
    }

    public Map<String, Long> serviceFrequency() {
        Map<String, Long> freq = new HashMap<>();
        for (Service s : services) {
            freq.put(s.getType(), freq.getOrDefault(s.getType(), 0L) + 1);
        }
        return freq;
    }

    private Map<Integer, Double> revenueByMerchant() {
        Map<Integer, Double> map = new HashMap<>();
        for (Invoice inv : invoices) {
            double sum = inv.getServiceIds().stream()
                    .map(id -> services.get(id - 1).getPrice())
                    .reduce(0.0, Double::sum);
            map.put(inv.getMerchantId(), map.getOrDefault(inv.getMerchantId(), 0.0) + sum);
        }
        return map;
    }

    private Map<Integer, Long> deliveriesPerClient() {
        return deliveries.stream()
                .collect(Collectors.groupingBy(Delivery::getClientId, Collectors.counting()));
    }

    public void generateCharts(String chartDir) throws IOException {
        new File(chartDir).mkdirs();
        DefaultPieDataset<String> pie1 = new DefaultPieDataset<>();
        for (Map.Entry<String, Long> e : serviceFrequency().entrySet()) {
            pie1.setValue(e.getKey(), e.getValue());
        }
        JFreeChart pieChart = ChartFactory.createPieChart("Types de prestations", pie1, true, true, false);
        ChartUtils.saveChartAsPNG(new File(chartDir + "/services_pie.png"), pieChart, 600, 400);

        DefaultCategoryDataset bar1 = new DefaultCategoryDataset();
        for (Service s : services) {
            bar1.addValue(s.getPrice(), "Prix", s.getType());
        }
        JFreeChart barChart = ChartFactory.createBarChart("Prix des prestations", "Type", "Prix", bar1);
        ChartUtils.saveChartAsPNG(new File(chartDir + "/services_bar.png"), barChart, 600, 400);

        // Additional simple charts based on revenue and top clients
        DefaultPieDataset<String> pie2 = new DefaultPieDataset<>();
        for (Client c : clients) {
            long count = invoices.stream().filter(i -> i.getClientId() == c.getId()).count();
            pie2.setValue(c.getName(), count);
        }
        JFreeChart pieClients = ChartFactory.createPieChart("Fréquence Clients", pie2, true, true, false);
        ChartUtils.saveChartAsPNG(new File(chartDir + "/clients_pie.png"), pieClients, 600, 400);

        DefaultCategoryDataset bar2 = new DefaultCategoryDataset();
        for (Client c : clients) {
            long count = invoices.stream().filter(i -> i.getClientId() == c.getId()).count();
            bar2.addValue(count, "Factures", c.getName());
        }
        JFreeChart barClients = ChartFactory.createBarChart("Factures par Client", "Client", "Nombre", bar2);
        ChartUtils.saveChartAsPNG(new File(chartDir + "/clients_bar.png"), barClients, 600, 400);

        DefaultPieDataset<String> pie3 = new DefaultPieDataset<>();
        for (Map.Entry<Integer, Double> e : revenueByMerchant().entrySet()) {
            Merchant m = merchants.get(e.getKey() - 1);
            pie3.setValue(m.getName(), e.getValue());
        }
        JFreeChart pieMerchants = ChartFactory.createPieChart("CA par Commer\u00e7ant", pie3, true, true, false);
        ChartUtils.saveChartAsPNG(new File(chartDir + "/merchants_pie.png"), pieMerchants, 600, 400);

        DefaultCategoryDataset bar3 = new DefaultCategoryDataset();
        for (Map.Entry<Integer, Double> e : revenueByMerchant().entrySet()) {
            Merchant m = merchants.get(e.getKey() - 1);
            bar3.addValue(e.getValue(), "CA", m.getName());
        }
        JFreeChart barMerchants = ChartFactory.createBarChart("CA par Commer\u00e7ant", "Commer\u00e7ant", "CA", bar3);
        ChartUtils.saveChartAsPNG(new File(chartDir + "/merchants_bar.png"), barMerchants, 600, 400);

        DefaultPieDataset<String> pie4 = new DefaultPieDataset<>();
        for (Map.Entry<Integer, Long> e : deliveriesPerClient().entrySet()) {
            Client c = clients.get(e.getKey() - 1);
            pie4.setValue(c.getName(), e.getValue());
        }
        JFreeChart pieDeliveries = ChartFactory.createPieChart("Livraisons par Client", pie4, true, true, false);
        ChartUtils.saveChartAsPNG(new File(chartDir + "/deliveries_pie.png"), pieDeliveries, 600, 400);

        DefaultCategoryDataset bar4 = new DefaultCategoryDataset();
        for (Map.Entry<Integer, Long> e : deliveriesPerClient().entrySet()) {
            Client c = clients.get(e.getKey() - 1);
            bar4.addValue(e.getValue(), "Livraisons", c.getName());
        }
        JFreeChart barDeliveries = ChartFactory.createBarChart("Livraisons par Client", "Client", "Nombre", bar4);
        ChartUtils.saveChartAsPNG(new File(chartDir + "/deliveries_bar.png"), barDeliveries, 600, 400);
    }
}
