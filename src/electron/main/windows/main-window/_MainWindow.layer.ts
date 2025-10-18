import { Context } from "effect";
import { IMainWindow } from "./_IMainWindow.interface"; 

export class MainWindow extends Context.Tag("MainWindow")<MainWindow, IMainWindow>() {}