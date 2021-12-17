package com.gmtkgamejam

import com.gmtkgamejam.koin.DatabaseModule
import com.gmtkgamejam.plugins.configureAuthRouting
import com.gmtkgamejam.plugins.configurePostRouting
import com.gmtkgamejam.plugins.configureRouting
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.serialization.*
import kotlinx.serialization.json.Json
import org.koin.core.context.startKoin
import org.koin.environmentProperties

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
        // FIXME: Only suppress CORS until we can easily sort it
        install(CORS)
        {
            method(HttpMethod.Options)

            header(HttpHeaders.XForwardedProto)
            header(HttpHeaders.Authorization)
            header(HttpHeaders.ContentType)
            header(HttpHeaders.AccessControlAllowHeaders)
            header(HttpHeaders.AccessControlAllowOrigin)

            anyHost()
        }
    }

    startKoin {
        environmentProperties()
        modules(DatabaseModule)
    }

    configureRouting()
    configureAuthRouting()
    configurePostRouting()
}
