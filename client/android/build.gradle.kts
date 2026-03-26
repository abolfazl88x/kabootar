plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.chaquo.python")
}

android {
    namespace = "com.abolfazl.kabootar"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.abolfazl.kabootar"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        // Chaquopy
        python {
            // مسیر پایتون روی runner یا سرور شما
            buildPython = "/usr/bin/python3"
            pip {
                install("markupsafe")
            }
        }
    }

    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
        }
        getByName("debug") {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

// === تعریف تسک سینک پایتون (موجود در Kabootar) ===
val syncKabootarPython by tasks.registering {
    group = "python"
    description = "Sync Kabootar Python sources"
    doLast {
        println("Syncing Kabootar Python sources...")
        // مسیرها و logic اصلی sync خودت اینجا باشه
    }
}

// === حل خطای mergeDebugPythonSources ===
tasks.matching { it.name.contains("PythonSources") }
    .configureEach {
        dependsOn(syncKabootarPython)
    }

// dependencies اندروید و kotlin
dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.7.1")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.3.0")
    implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.24")
}
