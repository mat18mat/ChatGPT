# Java Demo Application

This application generates sample data, charts, and a PDF report using Java Swing.

## Prerequisites
- Java 17+
- Maven 3+

## Build and Run
```bash
mvn package
java -cp target/app-1.0-SNAPSHOT.jar com.example.app.MainApp
```

The interface provides buttons to generate data (stored in `data/`), produce charts (in `charts/`), generate a PDF (`pdf/report.pdf`) and open the report.
