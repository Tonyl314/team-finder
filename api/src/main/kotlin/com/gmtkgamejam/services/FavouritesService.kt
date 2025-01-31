package com.gmtkgamejam.services

import com.gmtkgamejam.models.FavouritePostDto
import com.gmtkgamejam.models.FavouritesList
import com.gmtkgamejam.repositories.FavouritesRepository
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class FavouritesService : KoinComponent {
    private val repository: FavouritesRepository by inject()

    fun getFavouritesByUserId(discordId: String): FavouritesList {
        return repository.getFavouritesByUserId(discordId) ?: FavouritesList(discordId)
    }

    fun saveFavourites(favourites: FavouritesList): FavouritesList {
        repository.saveFavourites(favourites)
        return favourites
    }

    fun addPostAsFavourite(discordId: String, post: FavouritePostDto) =
        this.saveFavourites((repository.getFavouritesByUserId(discordId) ?: FavouritesList(discordId))
            .also {
                it.postIds.add(post.id)
            }
        )
}

