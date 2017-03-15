angular.module('music.services', [])
.service('PlaylistService', function($q, $http) {
  // este objeto armazena o array de playlists, quando tivermos
  // buscado ele via AJAX
  let playlistsCache = null;

  return {
    // esta função verifica se já temos as playlists em cache e,
    // em caso afirmativo, já "retorna" (cumpre/resolve a
    // promessa). Do contrário, faz a requisição AJAX e, em caso
    // de sucesso, resolve a promessa
    getPlaylists: function() {
      let deferred = $q.defer();
      if (!playlistsCache) {
        $http.get('http://mah-music-api.herokuapp.com/playlists')
          .success(function(data) {
            playlistsCache = data;
            deferred.resolve(playlistsCache);
          })
          .error(function(err) {
            reject(err);
          });
      } else {
        deferred.resolve(playlistsCache);
      }

      return deferred.promise;
    },

    // esta função recebe um id de playlist e chama a função
    // que fornece o array de playlists. Assim que esse array
    // está em mãos (que pode demorar um pouco, se precisar
    // fazer a requisição AJAX, ou pode ser imediato, se já a
    // tiver feito), percorre o array para retornar apenas a
    // playlist cujo id foi passado por parâmetro
    getPlaylist: function(id) {
      return this.getPlaylists().then(function(playlists) {
        return playlists.filter(function(p) { return p._id === id })[0] || null;
      });
    }
  }
});
