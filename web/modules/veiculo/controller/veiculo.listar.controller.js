(function () {
    'use strict';

    angular
    .module('cdm.system.module.veiculo')
    .controller('VeiculoListarController', VeiculoListarController);

    VeiculoListarController.$inject = ['$scope','VeiculoService','VeiculoFactory','$state'];


    function VeiculoListarController($scope, VeiculoService,VeiculoFactory,$state) {
        //Atributos
        var vm = this;
        vm.titulo = "Listagem dos Veiculos";  
        vm.veiculos = [];
        vm.maxSize = 3;
        vm.totalItems = 0;
        vm.currentPage = 1;
        vm.registrosPorPagina = 5;
        vm.selectTop = [5,10,15,20];
        vm.pesquisa = '';
        vm.order = 'bosque';
        vm.sort = true;
    

        //Instancia Metodos
        vm.findByFilter = findByFilter;
        vm.atualizar = atualizar;
        vm.remover = remover;
        vm.visualizar = visualizar;
        vm.registrosPorPaginaAlterados = registrosPorPaginaAlterados;
        vm.pesquisar = pesquisar;
        vm.sorter = sorter;
        vm.sorterIconCheck = sorterIconCheck;
        

        //Metodos
        function sorter(ordem){
            vm.sort = !vm.sort;
            vm.order = ordem;
            vm.findByFilter(vm.currentPage,vm.registrosPorPagina,vm.pesquisa,vm.order,vm.sort);
        }

        function sorterIconCheck(coluna){
            if(coluna === vm.order && vm.sort === true){
                return 'sorting_asc';
            }else if(coluna === vm.order && vm.sort === false){
                return 'sorting_desc';
            }else{
                return 'sorting';
            }
        }

        function pesquisar(){
            vm.findByFilter(vm.currentPage,vm.registrosPorPagina,vm.pesquisa,vm.order,vm.sort);
        }
        
        function registrosPorPaginaAlterados(){
            vm.findByFilter(vm.currentPage,vm.registrosPorPagina,vm.pesquisa,vm.order,vm.sort);
        }

        vm.setPage = function (pageNo) {
            vm.currentPage = pageNo;
        };

        vm.pageChanged = function() {
            vm.findByFilter(vm.currentPage,vm.registrosPorPagina,vm.pesquisa,vm.order,vm.sort);
        };

        
        function activate() {
           vm.findByFilter(vm.currentPage,vm.registrosPorPagina,vm.pesquisa,vm.order,vm.sort);
        }

        function visualizar (objeto) {
        objeto.isView = true;
        VeiculoFactory.setVeiculo(objeto);
            $state.go('veiculo-manter');              
        }    

        function atualizar(objeto){
            objeto.isView = false;
            VeiculoFactory.setVeiculo(objeto);
            $state.go('veiculo-manter');
        }

        function remover(codigo){
            VeiculoService.remove(codigo).then(function onSuccess(response) {
                console.log(response.data);
                activate();
            }).catch(function onError(response) {
                console.log(response);
            });
        }


        function findByFilter(skipIn, takeIn, pesquisa, order, sort) {
            VeiculoService.findByFilter(skipIn, takeIn,pesquisa, order, sort).then(function onSuccess(response) {
                if(response.headers('X-Total-Registros') !== null && !angular.isUndefined(response.headers('X-Total-Registros'))){
                    vm.totalItems = parseInt(response.headers('X-Total-Registros'));
                }
                vm.veiculos = VeiculoFactory.convertList(response.data);                
            }).catch(function onError(response) {
                console.log(response);
            });
        };


        activate();

    }
})();
