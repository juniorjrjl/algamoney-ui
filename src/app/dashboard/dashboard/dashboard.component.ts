import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DashboardService } from './../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pieChartData: any;
  lineChartData: any;

  optionsLine = {
    tooltips: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.raw || 0;
          const formattedValue = this.decimalPipe.transform(value, '1.2-2', 'pt-BR')
          return `${label}: ${formattedValue}`;
        }
      }
    }
  };

  optionsPie = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any): any => {
            let label = context.label || '';
            let value = context.raw || 0;
            let formattedValue = this.decimalPipe.transform(value, '1.2-2', 'pt_BR');
            return `${label}: ${formattedValue}`;
          }
        }
      }
    }
  }

  constructor(
    private dashboardService: DashboardService,
    private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    this.configurarGraficoPizza();
    this.configurarGraficoLinha();
  }

  configurarGraficoPizza() {
    this.dashboardService.lancamentosPorCategoria()
      .then(dados => {
        this.pieChartData = {
          labels: dados!.map(dado => dado.categoria.nome),
          datasets: [
            {
              data: dados!.map(dado => dado.total),
              backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#3366CC', '#DC3912']
            }
          ]
        };
      });
  }

  configurarGraficoLinha() {
    this.dashboardService.lancamentosPorDia()
      .then(dados => {
        const diasMes = this.configurarDiasMes();
        const totaisReceitas = this.totaisCadaDiasMes(dados!.filter(dado => dado.tipo === 'RECEITA'), diasMes);
        const totaisDespesas = this.totaisCadaDiasMes(dados!.filter(dado => dado.tipo === 'DESPESAS'), diasMes);
        this.lineChartData = {
          labels: diasMes,
          datasets: [
            {
              label: 'Receitas',
              data: totaisReceitas,
              borderColor: '#3366CC'
            }, 
            {
              label: 'Despesas',
              data: totaisDespesas,
              borderColor: '#D62B00'
            }
          ]
        };
      });
  }

  private totaisCadaDiasMes(dados: any, diasMes: any) {
    const totais: number[] = [];
    for (const dia of diasMes) {
      let total = 0;
      for (const dado of dados) {
        if (dado.dia.getDate() === dia) {
          total = dado.total;
          break;
        }
      }
      totais.push(total);
    }
  }

  private configurarDiasMes() {
    const mesReferencia = new Date();
    mesReferencia.setMonth(mesReferencia.getMonth() + 1);
    mesReferencia.setDate(0);
    const quantidade = mesReferencia.getDate();
    const dias:  number[] = [];
    for (let i = 1; i <= quantidade; i++) {
      dias.push(i);
    }
    return dias;
  }

}
